import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { fetchAttractions } from '../services/api';

export default function Home() {
  useEffect(() => {
    const testAPI = async () => {
      const data = await fetchAttractions();
      console.log('API Data:', data);
    };
    testAPI();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testing API</Text>
    </View>
  );
}

