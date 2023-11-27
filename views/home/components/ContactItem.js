import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useTheme from '../../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from './Avatar';

export default function ContactItem({item, onCallPress, onContactPress}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: theme.colors.lightBackground,
    },
    contactButton: {
      flexGrow: 1,
      margin: theme.size.marginSmall,
      padding: theme.size.padding,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.size.borderRadius,
    },
    contactInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      marginLeft: theme.size.margin,

    },
    avatar: {
      width: 50,
      aspectRatio: 1,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
    },
    itemHeader: {
      color: theme.colors.text,
      fontFamily: theme.text.font,
      fontSize: theme.text.headerText,
    },
    itemSecondary: {
      color: theme.colors.textSecondary,
      fontFamily: theme.text.font,
      fontSize: theme.text.bodyText,
    },
    callButton: {
      margin: theme.size.marginSmall,
    },
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => onContactPress(item)}>
        <View style={styles.contactInfoContainer} >
          <Avatar item={item} />
          <View style={styles.name} >
            <Text style={styles.itemHeader}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.itemSecondary}>{item.phone}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => onCallPress(item)}>
          <MaterialCommunityIcons
            name="video-wireless"
            size={30}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
