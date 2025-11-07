import React from "react";
import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import  useStore from "../store/useStore";
import { router} from 'expo-router' ;

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
  <Text style={styles.title}>Total: {attractions?.length} attractions</Text>
     {/* ADD THIS TEST BUTTON */}
    <Pressable 
      onPress={() => router.push('/test-animations')}
      style={[styles.button, { backgroundColor: '#FF6B6B', marginBottom: 20 }]}
    >
      <Text style={styles.buttonText}>Test Animations</Text>
    </Pressable>
  
  {attractions?.slice(0, 5).map((item) => (
    <Pressable 
      key={item.id} 
      onPress={() => router.push(`/details/${item.id}`)} // using each attraction real id 
      style={styles.button}
    >
      <Text style={styles.buttonText}>• {item.name}</Text>
    </Pressable>
  ))}
  
  <Text style={styles.success}>Store is working!</Text>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  name: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  success: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  button: {
  backgroundColor: '#007AFF',
  padding: 15,
  borderRadius: 8,
  marginVertical: 10,
},
  buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
});
