import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import * as React from 'react';
import {useEffect, useState, createContext, useContext} from 'react';
import {View, ActivityIndicator, LogBox} from 'react-native';
import HomeView from './views/home/Home';
import SettingsView from './views/settings/Settings';
import LoginView from './views/login/Login';
import RegisterView from './views/register/Register';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useTheme from './theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const AuthenticatedUserContext = createContext({});
export const ThemeContext = createContext({});

LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',
  'Require cycle: App.js',
  '->',
  'EventEmitter.removeListener',
]);

function NavigationTabs({theme}) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          labelStyle: {
            fontFamily: theme.font,
          },
          backgroundColor: theme.colors.background,
        },
        tabBarLabelStyle: {
          fontFamily: theme.font,
        },

        contentStyle: {
          backgroundColor: '#000',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeView}
        options={{
          tabBarLabel: 'Call',
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcons
              name={!focused ? 'phone-outline' : 'phone'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsView}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcons
              name={!focused ? 'cog-outline' : 'cog'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthenticationStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="Register" component={RegisterView} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [contacts, setContacts] = useState();
  useEffect(() => {
    if (user?.uid) {
      firestore().collection('user').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          setUserInfo(doc.data());
          firestore().collection('user').doc(user.uid).collection('contacts').get().then((contacts) => {
            let contactsArray = [];
            contacts.forEach((contact) => {
              console.log(contact.data());
              contactsArray.push(contact.data());
            })
            setContacts(contactsArray);
          })

        } else {
          console.log('No user data found!');
        }
      });
      
      
    }
    
  }, [user]);
  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        setUserInfo,
        contacts,
        setContacts,
      }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function RootNavigator() {
  const {user, setUser} = useContext(AuthenticatedUserContext);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    if (isLoading) setIsLoading(false);
  }
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth().onAuthStateChanged(onAuthStateChanged);

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [setUser, user]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <NavigationTabs theme={theme} /> : <AuthenticationStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
