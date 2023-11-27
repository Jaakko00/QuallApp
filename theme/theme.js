import {
  Text,
  View,
  ActivityIndicator,
  LogBox,
  Appearance,
  useColorScheme,
} from 'react-native';

const lightTheme = {
  colors: {
    primary: '#00A676',
    primaryLight: '#00D8A0',
    secondary: '#276fbf',
    secondaryLight: '#4A90E2',
    background: '#FDFDFD',
    lightBackground: '#F7F7F7',
    textBackground: '#EAEAEA',
    shadow: '#000',
    text: '#000',
    textSecondary: '#5E5E5E',
  },
  text: {
    callText: 24,
    hugeText: 32,
    headerText: 18,
    bodyText: 14,
    font: 'Futura',
  },
  opacity: {
    disabled: 0.33,
  },
  font: 'Futura',
  size: {
    margin: 10,
    marginSmall: 5,
    marginBig: 15,
    borderRadius: 10,
    padding: 10,
    paddingBig: 15,
    paddingSmall: 5,
  },
};
const darkTheme = {
  colors: {
    primary: '#00A676',
    primaryLight: '#005940',
    secondary: '#276fbf',
    secondaryLight: '#174375',
    background: '#171717',
    lightBackground: '#1e1e1e',
    textBackground: '#2c2c2c',
    shadow: '#000',
    text: '#fff',
    textSecondary: '#a5a5a5',
  },
  text: {
    callText: 24,
    hugeText: 32,
    headerText: 18,
    bodyText: 14,
    font: 'Futura',
  },
  font: 'Futura',
  opacity: {
    disabled: 0.33,
  },
  size: {
    margin: 10,
    marginSmall: 5,
    marginBig: 15,
    borderRadius: 10,
    padding: 10,
    paddingBig: 15,
    paddingSmall: 5,
  },
};

const useTheme = () => {
  const colorScheme = useColorScheme(); // Kutsutaan käyttöjärjestelmän teemaa
  
  return colorScheme === 'dark' ? darkTheme : lightTheme; // Palautetaan teeman tiedot käyttöjärjestelmän teeman perusteella
};

export default useTheme;
