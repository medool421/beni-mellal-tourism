import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';

export default function Home() {
  const { attractions, loading, error, fetchAttractions } = useStore();

  useEffect(() => {
    fetchAttractions();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading attractions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total: {attractions.length} attractions</Text>
      {attractions.slice(0, 5).map(item => (
        <Text key={item.id} style={styles.name}>• {item.name}</Text>
      ))}
      <Text style={styles.success}>✅ Store is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  name: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  success: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
});