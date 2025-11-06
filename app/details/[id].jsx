import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import useStore from "../../store/useStore";
import { router } from "expo-router";

export default function Details() {
  const { id } = useLocalSearchParams(); //it extract the id from URL  r
  const { attractions, isFavorite, toggleFavorite, loading, fetchAttractions } =
    useStore(); // to get data from zustand

  // DEBUG LOGS:
  console.log("=== DETAILS SCREEN DEBUG ===");
  console.log("Loading:", loading);
  console.log("Attractions:", attractions);
  console.log("Attractions length:", attractions?.length);
  console.log("ID from URL:", id);

  useEffect(() => {
    if (!attractions || attractions.length === 0) {
      fetchAttractions();
    }
  }, []);
  const attraction = attractions.find((item) => item.id == id);

  //adding checks
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!attraction) {
    return (
      <View style={styles.center}>
        <Text>No attractions loaded!</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image 
      source={{uri: attraction.thumbnail}}
      style = {styles.heroImage}/>
      <Text style={styles.title}>{attraction.name}</Text>
      <Text style={styles.description}>{attraction.description}</Text>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage : {
    width: '100%',
    height : 300 ,
  }
});
