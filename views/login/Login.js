import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ThemeContext} from '../../App';
import auth from '@react-native-firebase/auth';
import useTheme from '../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

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

  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => console.log('Login success'))
        .catch(err => handleLoginError(err));
    } else {
      console.log('Please give email and password');
    }
  };

  const handleLoginError = err => {
    setError(true);
    setEmail('');
    setPassword('');
    console.log(err);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.background}>
          
            <View
              style={{
                position: 'absolute',
                bottom: -600,
                right: -750,
                width: '300%',
                aspectRatio: 1,
                borderRadius: 1000,
                backgroundColor: theme.colors.primaryLight,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -400,
                right: -500,
                width: '200%',
                aspectRatio: 1,
                borderRadius: 1000,
                backgroundColor: theme.colors.primary,
              }}
            />
          

          <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              style={{
                alignItems: 'center',
              }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              

              >
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Welcome back!</Text>
              </View>
              <View style={styles.loginContainer}>
                <View>
                  <Text style={styles.loginHeader}>SIGN IN</Text>
                </View>
                {error && (
                  <View>
                    <Text>Invalid username or password</Text>
                  </View>
                )}
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={text => setEmail(text)}
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
                    name={password.length ? 'lock-open' : 'lock'}
                    size={24}
                    color={
                      password.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.loginButtonContainer}>
                  <TouchableOpacity
                    style={
                      !(password.length && email.length)
                        ? styles.buttonDisabled
                        : styles.button
                    }
                    disabled={!(password.length && email.length)}
                    onPress={onHandleLogin}>
                    <Text style={styles.buttonText}>Sign in</Text>

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
                    {"Don't have an account?"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Sign up!</Text>
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
