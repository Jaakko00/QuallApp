import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch
} from 'react-native';
import useTheme from '../../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingSwitch({item}) {
  
  const theme = useTheme();

  const styles = StyleSheet.create({
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      
      height: 50,
      backgroundColor: theme.colors.textBackground,
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
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{item.name}</Text>
      <Switch
        trackColor={{
          false: theme.colors.background,
          true: theme.colors.background,
        }}
        thumbColor={item.value ? theme.colors.primary : theme.colors.lightBackground}
        onValueChange={item.function}
        value={item.value}
      />
    </View>
  );
}
