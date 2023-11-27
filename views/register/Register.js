import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';

import {ThemeContext} from '../../App';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import useTheme from '../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Register({navigation}) {
  const theme = useTheme();

  const styles = {
    container: {
      justifyContent: 'center',
    },
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: theme.size.margin,
    },
    headerText: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.hugeText,
      margin: theme.size.margin,
    },
    background: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.lightBackground,
    },
    loginContainer: {
      width: '90%',
      backgroundColor: theme.colors.background,
      padding: theme.size.padding,
      borderRadius: theme.size.borderRadius,
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    loginHeader: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.callText,

      margin: theme.size.margin,
    },
    input: {
      margin: theme.size.margin,
      color: theme.colors.text,
      fontSize: theme.text.headerText,
      padding: theme.size.padding,
      borderRadius: 50,
      backgroundColor: theme.colors.textBackground,
      fontFamily: theme.font,
    },
    textInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 50,
      backgroundColor: theme.colors.textBackground,
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      padding: theme.size.paddingBig,
      margin: theme.size.margin,
    },
    textInput: {
      flex: 1,
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.headerText,
    },
    loginButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    button: {
      width: '60%',

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      margin: theme.size.margin,
      padding: theme.size.paddingBig,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    buttonDisabled: {
      width: '60%',
      opacity: theme.opacity.disabled,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 50,
      backgroundColor: theme.colors.textBackground,
      margin: theme.size.margin,
      padding: theme.size.paddingBig,
      shadowColor: theme.colors.textBackground,
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    buttonText: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.headerText,
    },
    textInputIcon: {},
    registerButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: theme.size.margin,
    },
    registerText: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.bodyText,
    },
    registerButton: {
      marginLeft: theme.size.marginSmall,
    },
    registerButtonText: {
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.text.bodyText,
      textDecorationLine: 'underline',
    },
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+358 40 123 4567');

  const onHandleSignup = async () => {
    // Tarkistetaan että sähköposti ja salasana on annettu ja että salasanat täsmäävät
    if (email !== '' && password !== '' && passwordAgain === password) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          // Kutsutaan funktiota, joka luo käyttäjän myös tietokantaan
          createUser(user.user);
        })
        .catch(err => console.log(err));
    }
  };

  // Luodaan käyttäjä tietokantaan
  const createUser = async user => {
    if (user) {
      await firestore().collection('user').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      });
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.background}>
          <View
            style={{
              position: 'absolute',
              top: -600,
              left: -750,
              width: '300%',
              aspectRatio: 1,
              borderRadius: 1000,
              backgroundColor: theme.colors.secondaryLight,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: -400,
              left: -500,
              width: '200%',
              aspectRatio: 1,
              borderRadius: 1000,
              backgroundColor: theme.colors.secondary,
            }}
          />

          <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              style={{
                alignItems: 'center',
              }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{"Let's get started!"}</Text>
              </View>
              <View style={styles.loginContainer}>
                <View>
                  <Text style={styles.loginHeader}>SIGN UP</Text>
                </View>

                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="Let's get your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.textInput}
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name="email"
                    size={24}
                    color={
                      email.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>

                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="Enter password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.textInput}
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={password.length >= 6 ? 'lock-check' : 'lock'}
                    size={24}
                    color={
                      password.length >= 6
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="Enter password again"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="password"
                    value={passwordAgain}
                    onChangeText={text => setPasswordAgain(text)}
                    style={styles.textInput}
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={
                      passwordAgain.length >= 6 && password === passwordAgain
                        ? 'lock-check'
                        : 'lock'
                    }
                    size={24}
                    color={
                      passwordAgain.length >= 6 && password === passwordAgain
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.loginButtonContainer}>
                  <TouchableOpacity
                    style={
                      !(
                        password.length >= 6 &&
                        email.length &&
                        password === passwordAgain
                      )
                        ? styles.buttonDisabled
                        : styles.button
                    }
                    disabled={
                      !(
                        password.length >= 6 &&
                        email.length &&
                        password === passwordAgain
                      )
                    }
                    onPress={() =>
                      onHandleSignup(email, password, passwordAgain)
                    }>
                    <Text style={styles.buttonText}>Sign up</Text>
                    <MaterialCommunityIcons
                      style={styles.textInputIcon}
                      name="arrow-right"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <View style={styles.registerButtonContainer}>
                  <Text style={styles.registerText}>
                    {'Already have an account?'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Sign in!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
