import React, { useContext} from "react";
import { View, Text, Button } from "react-native";
import auth from '@react-native-firebase/auth';
import { AuthenticatedUserContext } from "../../App";
import useTheme from "../../theme/theme";

export default function Settings() {
  const {user, userInfo, contacts} = useContext(AuthenticatedUserContext);
  const theme = useTheme();
  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.lightBackground,
      }}>
      <Text style={{color: theme.colors.text}}>
        {userInfo.firstName} {userInfo.lastName}
      </Text>
      <Text style={{color: theme.colors.text}}>{userInfo.email}</Text>
      <Text style={{color: theme.colors.text}}>{userInfo.phone}</Text>
      <Button title="Logout" onPress={() => auth().signOut()} />
    </View>
  );
}
