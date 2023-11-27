import React, {useState} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import useTheme from '../../theme/theme';
import Avatar from './components/Avatar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingSwitch from './components/SettingSwitch';
import SettingButton from './components/SettingButton';

export default function Contact({navigation, route}) {
  const {firstName, lastName, nickname, phone} = route.params;
  const [mute, setMute] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: theme.colors.secondary,
      flexGrow: 1,
    },
    topContainer: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: theme.colors.secondary,
      borderBottomStartRadius: 50,
    },
    nameContainer: {},
    infoContainer: {
      marginLeft: theme.size.marginBig,
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    topBackground: {
      width: '100%',
      backgroundColor: theme.colors.lightBackground,
    },
    middleBackground: {
      width: '100%',
      flexGrow: 1,
      backgroundColor: theme.colors.secondary,
    },
    middleContainer: {
      width: '100%',
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme.colors.lightBackground,
      borderTopRightRadius: 50,
    },
    callButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',

      padding: theme.size.padding,

      borderRadius: 50,

      alignItems: 'center',
    },
    callButtonTextContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: theme.colors.secondary,
    },
    callButtonText: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.headerText,
    },
    buttonIcon: {
      backgroundColor: theme.colors.text,
      padding: theme.size.paddingSmall,
      borderRadius: 50,
    },

    nameText: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.callText,
    },
    phoneText: {
      color: theme.colors.textSecondary,
      fontFamily: theme.font,
      fontSize: theme.text.headerText,
    },
  });

  const setSetting = name => {
    console.log('Setting set: ' + name);
  };

  const settingItems = [
    {
      name: 'Mute',
      value: mute,
      function: setMute,
    },
    {
      name: 'Notifications',
      value: notifications,
      function: setNotifications,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <View style={styles.topContainer}>
          <Avatar item={route.params} />
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>
                {firstName} {lastName}
              </Text>
              <Text style={styles.phoneText}>{phone}</Text>
            </View>

            <TouchableOpacity style={styles.callButton}>
              <View style={styles.callButtonTextContainer}>
                <Text style={styles.callButtonText}>Video call</Text>
              </View>
              <View style={styles.buttonIcon}>
                <MaterialCommunityIcons
                  name="video-wireless"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.middleBackground}>
        <View style={styles.middleContainer}>
          <SettingButton
            item={{name: 'Call history'}}
            color={theme.colors.background}
          />

          {settingItems.map((setting, index) => (
            <SettingSwitch item={setting} key={index} />
          ))}
          <SettingButton
            item={{name: 'Share contact'}}
            color={theme.colors.background}
          />
          <SettingButton item={{name: 'Delete contact'}} color={'red'} />
          <SettingButton item={{name: 'Block contact'}} color={'red'} />
        </View>
      </View>
    </View>
  );
}
