import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  SectionList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Call from '../../views/call/Call';
import AddContact from '../addContact/AddContact';
import Contact from '../contact/Contact';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import ContactItem from './components/ContactItem';
import ContactSection from './components/ContactSection';
import useTheme from '../../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthenticatedUserContext} from '../../App';

const Stack = createNativeStackNavigator();
const RootStack = createStackNavigator();

function CallList({searchText, navigation}) {
  const {user, userInfo, contacts} = useContext(AuthenticatedUserContext);
  const theme = useTheme();

  const [callVisible, setCallVisible] = useState(false);
  const [inCallContact, setInCallContact] = useState(null);
  const [contactSectionList, setContactSectionList] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  // const [contacts, setContacts] = useState([
  //   {
  //     name: 'Makke Soisalo',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Jere Joensuu',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Lumi Martikkala',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Leevi Rantanen',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Santtu Välimaa',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Miro Rauhala',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Miro Nevala',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Tikru 🐱',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Jyri Ruohoniemi',
  //     number: '1234567890',
  //   },
  //   {
  //     name: 'Liisa Nurminen',
  //     number: '1234567890',
  //   },
  // ]);

  useEffect(() => {

    // 1. Järjestä yhteystiedot aakkosjärjestykseen
    const sortedContacts = filteredContacts.sort((a, b) =>
      a.firstName.localeCompare(b.firstName),
    );

    // 2. Luo osiot aakkosjärjestyksessä
    const sections = sortedContacts.reduce((acc, contact) => {
      const firstLetter = contact.firstName.charAt(0).toUpperCase();
      // Luo osio aakkosen mukaan, jos sitä ei ole vielä olemassa, muuten lisää yhteystieto osioon
      if (!acc[firstLetter]) {
        acc[firstLetter] = {
          title: firstLetter,
          data: [contact],
        };
      } else {
        acc[firstLetter].data.push(contact);
      }
      return acc;
    }, {});

    // 3. Muuta objekti taulukoksi
    const result = Object.values(sections);

    // 4. Aseta taulukko tilamuuttujaan
    setContactSectionList(result);

  }, [filteredContacts]);

  useEffect(() => {
    if (searchText) {
      const filteredContacts = contacts.filter(
        contact =>
          contact.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.phone.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredContacts(filteredContacts);
    } else {
      if (contacts) {
        setFilteredContacts(contacts);
      }
    }
  }, [searchText, contacts]);

  const onCallStart = item => {
    console.log(item);
    setInCallContact(item);
    setCallVisible(true);
  };

  const onContactPress = item => {
    navigation.navigate('Contact', item);
  };

  const onCallEnd = () => {
    setCallVisible(false);
    setInCallContact(null);
  };

  return (
    <>
      <SafeAreaView
        style={{flexGrow: 1, backgroundColor: theme.colors.lightBackground}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flexGrow: 1}}>


          <SectionList
            sections={contactSectionList}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
              <ContactItem // Näyttää yhteystiedon
                item={item}
                onCallPress={onCallStart} // Siirtää puhelunäkymään ja aloittaa uuden puhelun
                onContactPress={onContactPress} // Siirtää yhteystiedon näkymään
              />
            )}
            renderSectionHeader={({section: {title, data}}) => (
              <ContactSection title={title} data={data} /> // Näyttää otsikon osioiden välissä
            )}
            contentInsetAdjustmentBehavior="automatic"
          />


        </KeyboardAvoidingView>
      </SafeAreaView>

      <Call
        callVisible={callVisible}
        setCallVisible={setCallVisible}
        inCallContact={inCallContact}
        onCallEnd={onCallEnd}
      />
    </>
  );
}

export default function Home() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CallList"
        options={({navigation, route}) => ({
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontFamily: theme.font,

            color: theme.colors.text,
          },
          headerTitleStyle: {
            fontFamily: theme.font,
            fontSize: theme.text.headerText,
            color: theme.colors.text,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitle: 'Contacts',
          headerSearchBarOptions: {
            placeholder: 'Search',
            hideWhenScrolling: false,
            onChangeText: e => setSearchText(e.nativeEvent.text),
            value: searchText,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddContact');
              }}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                color={theme.colors.secondary}
              />
            </TouchableOpacity>
          ),
        })}>
        {props => <CallList {...props} searchText={searchText} />}
      </Stack.Screen>
      <Stack.Screen
        name="AddContact"
        component={AddContact}
        options={() => ({
          headerTitleStyle: {
            fontFamily: theme.font,
            fontSize: theme.text.headerText,
            color: theme.colors.text,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerBackTitleStyle: {
            fontFamily: theme.font,
          },
        })}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={() => ({
          title: '',
          headerTitleStyle: {
            fontFamily: theme.font,
            fontSize: theme.text.headerText,
            color: theme.colors.text,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerBackTitleStyle: {
            fontFamily: theme.font,
          },
        })}
      />
    </Stack.Navigator>
  );
}
