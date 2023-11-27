import React, {useState, useRef, useEffect} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  mediaDevices,
  RTCView,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Call({callVisible, setCallVisible}) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [webcamStarted, setWebcamStarted] = useState(false);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log(local);

    setLocalStream(local);

    const remote = new MediaStream();
    setRemoteStream(remote);

    // Push tracks from local stream to peer connection
    local.getTracks().forEach(track => {
      pc.current.addTrack(track, local);
    });

    // Pull tracks from peer connection, add to remote video stream
    pc.current.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remote.addTrack(track);
      });
    };

    pc.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };
    setWebcamStarted(true);
  };

  const endCall = async () => {
    const tracks = localStream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }

    if (pc.current) {
      pc.current.close();
    }

    setWebcamStarted(false);
    setChannelId(null);
    setLocalStream(null);
    setRemoteStream(null);
    setCallVisible(false);
  };

  useEffect(() => {
    if(!webcamStarted && callVisible) {
      startWebcam();
    }
  }, [callVisible]);

  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({offer});

    // Listen for remote answer
    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };
  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(channelId);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();

    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await channelDoc.update({answer});

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  return (
    <Modal
      animationType="slide"
      visible={callVisible}
      onRequestClose={() => {
        setCallVisible(false);
      }}>
      <View style={{flexGrow: 1}}>
        {localStream && (
          <View
            style={{
              position: 'absolute',
              top: '8%',
              right: '8%',
              aspectRatio: 2 / 3,
              width: '30%',
              backgroundColor: 'red',
              zIndex: 100,
              borderRadius: 10,
              overflow: 'hidden',
            }}>
            <RTCView
              streamURL={localStream?.toURL()}
              objectFit="cover"
              mirror
              style={{flexGrow: 1}}
            />
          </View>
        )}

        {remoteStream && (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'blue',
              flexGrow: 1,
            }}>
            <RTCView
              streamURL={remoteStream?.toURL()}
              objectFit="cover"
              mirror
              style={{flexGrow: 1}}
            />
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              flexDirection: 'row',
              marginBottom: 50,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 50,
                  aspectRatio: 1,
                }}>
                <MaterialCommunityIcons
                  name="microphone-off"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => endCall()}
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 50,
                  aspectRatio: 1,
                }}>
                <MaterialCommunityIcons
                  name="phone-hangup"
                  size={50}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 50,
                  aspectRatio: 1,
                }}>
                <MaterialCommunityIcons
                  name="camera-off"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
