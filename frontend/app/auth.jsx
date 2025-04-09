import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

export default function AuthHandlerScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const storeData = async (value) => {
    try {
        await AsyncStorage.setItem("auth_token", value);
    } catch (e) {
        console.log(e)
    }
  }

  useEffect(() => {
    const { token } = route.params || {};
    console.log(route.params)
    if (token) {
      // Save to storage
      storeData(token)
      // Navigate to logged-in area
      navigation.navigate('survey');
    }
  }, [route]);

  return null;
}