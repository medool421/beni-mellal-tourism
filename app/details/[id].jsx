import React, { useEffect ,useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
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
  const [showFullDescription, setShowFullDescription] = useState(false);
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
      <View style={styles.imageContainer}>
      <Image 
      source={{uri: attraction.thumbnail}}
      style = {styles.heroImage}/>
      <ScrollView style= {styles.infoCard} ContentContainerStyle = {styles.infoCardContent}>
        <Text style={styles.title}>{attraction.name}</Text>
        <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>
        <Text style={styles.location}>📍 Location here</Text>
        <Text style={styles.description} numberOfLines={showFullDescription? undefined :3}>{attraction.description}</Text>
        <Pressable onPress ={() => setShowFullDescription (!showFullDescription)}>
          <Text style ={styles.readMore}>
            {showFullDescription ? 'Read Less' : 'Read More'}
          </Text>
        </Pressable>
      </ScrollView>
      </View>
    </View>


  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer:{
    width : '100%',
    height : 500,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  rating:{
    fontSize: 14,
    marginTop : 3,
    marginBottom : 4,
  },
  location:{
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description:{
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  readMore:{
    fontSize:12,
    color : '#555',
    fontWeight:  '600',
    marginTop : 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage : {
    width: '100%',
    height : '100%',
  },
  infoCard: {
    position: 'absolute', //to make it float
    bottom: 30,
    left : 20,
    right: 20,
    backgroundColor : 'rgba(255 ,255 ,255 , 0.92)',
    borderRadius : 20,
    padding : 12,
    maxHeight: 180,
    shadowColor : '#000',
    shadowOffset : {width: 0 , height :2},
    shadowOpacity : 0.25,
    shadowRadius : 3.84,
    elevation: 5, //shadow for androind
  },
  infoCardContent:{
    padding :12,
  },


});
