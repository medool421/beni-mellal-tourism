import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { fetchAttractions } from '../services/api';
// Home component to test API integration
export default function Home() {
  useEffect(() => {
    {/* Test the API call */}
    const testAPI = async () => {
      const data = await fetchAttractions();
      console.log('API Data:', data);
    };
    testAPI();
  }, []);
// Render a simple view
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testing API</Text>
    </View>
  );
}