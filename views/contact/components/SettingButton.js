import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useTheme from '../../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingButton({item, color}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      
      height: 50,
      backgroundColor: color,
      borderRadius: theme.size.borderRadius,
      margin: theme.size.margin,
    },
    settingText: {
      color: theme.colors.text,
      fontFamily: theme.text.font,
      fontSize: theme.text.headerText,
    },
  });
  return (
    <TouchableOpacity style={styles.settingItem}>
      <Text style={styles.settingText}>{item.name}</Text>
    </TouchableOpacity>
  );
}
