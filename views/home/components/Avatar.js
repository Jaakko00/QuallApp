import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import useTheme from '../../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Avatar({item}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    avatar: {
      overflow: 'hidden',
      borderRadius: 50,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    character: {
      color: theme.colors.primary,
      fontFamily: theme.text.font,
      fontSize: theme.text.hugeText,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  });
  return (
    <View style={styles.avatar}>
      <Image
        source={require('../../../assets/avatar.jpg')}
        style={{width: 50, height: 50}}></Image>
    </View>
  );
}
