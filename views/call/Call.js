import React, {useState, useRef, useEffect} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Button,
  TextInput,
  StyleSheet,
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
import useTheme from '../../theme/theme';

export default function Call({
  callVisible,
  setCallVisible,
  inCallContact,
  onCallEnd,
}) {
  const name = inCallContact?.name || 'Unknown';
  const number = inCallContact?.number || 'Unknown';
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 16,
    },
    localStream: {
      position: 'absolute',
      top: '8%',
      right: '8%',
      aspectRatio: 2 / 3,
      width: '30%',
      backgroundColor: 'black',
      zIndex: 100,
      borderRadius: 10,
      overflow: 'hidden',
    },
    localStreamIcons: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: theme.size.padding,
    },
    remoteStream: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.shadow,
      flexGrow: 1,
    },
    remoteStreamEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    remoteStreamText: {
      color: "white",
      fontFamily: theme.font,
      fontSize: theme.text.callText,
    }
  });
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [channelId, setChannelId] = useState(null);
  const peerConnection = useRef(null);

  

  const startLocalStream = async () => {
    const showFrontCam = true;
    const devices = await mediaDevices.enumerateDevices();

    const cameraDirection = showFrontCam ? 'front' : 'environment';
    const videoSourceId = devices.find(
      device => device.kind === 'videoinput' && device.cameraDirection === cameraDirection,
    );
    const facingMode = showFrontCam ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);

    const servers = {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302'],
        },
      ],
      iceCandidatePoolSize: 10,
    };

    // Luodaaan RTCPeerConnection
    peerConnection.current = new RTCPeerConnection(servers);


  };

  const startCall = async id => {
    localStream
      .getTracks()
      .forEach(track => peerConnection.current.addTrack(track, localStream));
    console.log('peerConnection.current', peerConnection.current);
    const roomRef = await firestore().collection('rooms').doc(id);
    console.log('roomRef', roomRef);
    const callerCandidatesCollection = roomRef.collection('callerCandidates');
    peerConnection.current.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    };

    peerConnection.current.onaddstream = e => {
      if (e.stream && remoteStream !== e.stream) {
        console.log('RemotePC received the stream call', e.stream);
        setRemoteStream(e.stream);
      }
    };
    peerConnection.current.ontrack = e => {
      console.log('RemotePC received the stream call', e.streams[0]);
      setRemoteStream(e.streams[0]);
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    const roomWithOffer = {offer};
    await roomRef.set(roomWithOffer);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.current.currentRemoteDescription && data.answer) {
        // Lisää vastaanottajan SDP-tiedon peerConnection -olioon
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.current.setRemoteDescription(
          rtcSessionDescription,
        );
      }
    });

    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        // Lisää uuden ICE-kandidaatin peerConnection -olioon
        if (change.type === 'added') {
          let data = change.doc.data();
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data),
          );
        }
      });
    });

  };

  const joinCall = async id => {
    const roomRef = await firestore().collection('rooms').doc(id);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) return;

    localStream
      .getTracks()
      .forEach(track => peerConnection.current.addTrack(track, localStream));

    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    peerConnection.current.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      calleeCandidatesCollection.add(e.candidate.toJSON());
    };

    peerConnection.current.onaddstream = e => {
      if (e.stream && remoteStream !== e.stream) {
        console.log('RemotePC received the stream join', e.stream);
        setRemoteStream(e.stream);
      }
    };
    peerConnection.current.ontrack = e => {
      console.log('RemotePC received the stream call', e.streams[0]);
      setRemoteStream(e.streams[0]);
    };

    const offer = roomSnapshot.data().offer;
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer),
    );

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    const roomWithAnswer = {answer};
    await roomRef.update(roomWithAnswer);

    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data),
          );
        }
      });
    });
  };

  useEffect(() => {
    startLocalStream();
  }, []);

  const endCall = async () => {
    const tracks = localStream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setChannelId(null);
    setLocalStream(null);
    setRemoteStream(null);
    onCallEnd();
  };

  const switchCameraFeed = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
      //setIsMuted(!track.enabled);
    });
  };

  return (
    <Modal visible={callVisible}>
      <View style={{flexGrow: 1, backgroundColor: theme.colors.shadow}}>
        {localStream && (
          <View style={styles.localStream}>
            <RTCView
              streamURL={localStream?.toURL()}
              objectFit="cover"
              mirror
              style={{flexGrow: 1}}
            />
            <TouchableOpacity
              style={styles.localStreamIcons}
              onPress={switchCameraFeed}>
              <MaterialCommunityIcons
                name="camera-flip-outline"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.remoteStream}>
          {remoteStream ? (
            <RTCView
              streamURL={remoteStream?.toURL()}
              objectFit="cover"
              mirror
              style={{flexGrow: 1}}
            />
          ) : (
            <View style={styles.remoteStreamEmpty}>
              <Text style={styles.remoteStreamText}>{name}</Text>
            </View>
          )}
        </View>

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
                onPress={() => startCall('test4')}
                style={{
                  padding: 10,
                  borderRadius: 50,
                  aspectRatio: 1,
                }}>
                <MaterialCommunityIcons
                  name="microphone-off"
                  size={30}
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
                onPress={() => joinCall('test4')}
                style={{
                  padding: 10,
                  borderRadius: 50,
                  aspectRatio: 1,
                }}>
                <MaterialCommunityIcons
                  name="camera-off"
                  size={30}
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
