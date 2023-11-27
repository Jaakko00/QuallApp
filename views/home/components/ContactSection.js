import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useTheme from '../../../theme/theme';



export default function ContactSection({title, data}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.colors.lightBackground,
      padding: theme.size.padding,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    itemHeader: {
      color: theme.colors.text,
      fontFamily: theme.text.font,
      fontSize: theme.text.headerText,
      marginLeft: theme.size.marginSmall,
    },
    itemSecondary: {
      color: theme.colors.textSecondary,
      fontFamily: theme.text.font,
      fontSize: theme.text.bodyText,
      marginRight: theme.size.marginSmall,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.itemHeader}>{title}</Text>
      <Text style={styles.itemSecondary}>{data.length} {data.length > 1 ? "contacts" : "contact"}</Text>
    </View>
  );
}
