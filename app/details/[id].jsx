import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Modal, //modal is for map view
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useLocalSearchParams, router } from "expo-router";
import useStore from "../../store/useStore";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";

// Get device dimensions for responsive design
const { width, height } = Dimensions.get("window");

export default function Details() {
  // Get attraction ID from URL params
  const { id } = useLocalSearchParams();

  // Get data from Zustand store
  const { attractions, loading, fetchAttractions, isFavorite, toggleFavorite } =
    useStore();
  //state hooks:
  // State for read more/less toggle
  const [showFullDescription, setShowFullDescription] = useState(false);
  // State for map modal visibility
  const [showMap, setShowMap] = useState(false);
  //reanimated:
  const [favorite, setfavorite] = useState(isFavorite(id)); // check if this attraction is already favorite
  // Reanimated shared values
  const heartScale = useSharedValue(1); // this controls zoom
  const wiggleRotation = useSharedValue(0);

  // Function to handle favorite tap and trigger animation
  const handleFavorite = () => {
    toggleFavorite(id); // update store
    setfavorite(!favorite); // update local state

    // Zoom animation
    heartScale.value = withSequence(
      withTiming(1.5, { duration: 150 }), // zoom in
      withSpring(1, { damping: 8, stiffness: 200 }) // bounce back
    );
    // Animation: wiggle and bounce
    wiggleRotation.value = withSequence(
      withTiming(-20, { duration: 75 }),
      withTiming(20, { duration: 150 }),
      withTiming(-15, { duration: 100 }),
      withTiming(0, { duration: 75 })
    );
  };

  // Reanimated style
  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: heartScale.value },
      { rotate: `${wiggleRotation.value}deg` },
    ],
  }));

  // Fetch attractions on component mount if not already loaded
  useEffect(() => {
    if (!attractions || attractions.length === 0) {
      fetchAttractions();
    }
  }, []);

  // Find the specific attraction by ID (using == to handle string/number comparison)
  const attraction = attractions.find((item) => item.id == id);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error if attraction not found
  if (!attraction) {
    return (
      <View style={styles.center}>
        <Text>Attraction not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back button - floats on top left */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      {/*  Favorite Button - top right side */}
      <Pressable style={styles.favoriteButton} onPress={handleFavorite}>
        <Animated.View style={[animatedHeartStyle]}>
          <AntDesign
            name="heart"
            size={28}
            color={favorite ? "#dc5e5eff" : "#76cd4dff"}
          />
        </Animated.View>
      </Pressable>

      {/* Image container with hero image and info card */}
      <View style={styles.imageContainer}>
        {/* Hero image */}
        <Image
          source={{ uri: attraction.thumbnail }}
          style={styles.heroImage}
        />

        {/* Info card - overlays bottom of image */}
        <ScrollView
          style={styles.infoCard}
          contentContainerStyle={styles.infoCardContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Attraction name */}
          <Text style={styles.title}>{attraction.name}</Text>

          {/* Rating stars */}
          <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

          {/* Location - opens map on press */}
          <Pressable onPress={() => setShowMap(true)}>
            <Text style={styles.location}>📍 View on Map</Text>
          </Pressable>

          {/* Description with read more/less */}
          <Text
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {attraction.description}
          </Text>

          {/* Read more/less button */}
          <Pressable
            onPress={() => setShowFullDescription(!showFullDescription)}
          >
            <Text style={styles.readMore}>
              {showFullDescription ? "Read less" : "Read more"}
            </Text>
          </Pressable>
          {/* ADD GALLERY BUTTON HERE */}
          <Pressable
            style={styles.galleryBtn}
            onPress={() => router.push(`/gallery/${attraction.id}`)}
          >
            <Text style={styles.galleryBtnText}> Gallery</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Map Modal - shows when user clicks location */}
      <Modal
        visible={showMap}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapContainer}>
          {/* Close button for map */}
          <Pressable
            style={styles.closeButton}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.closeButtonText}> Close</Text>
          </Pressable>

          {/* Map with marker at attraction location */}
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            initialRegion={{
              latitude: parseFloat(attraction.coordination.latitude),
              longitude: parseFloat(attraction.coordination.longitude),
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(attraction.coordination.latitude),
                longitude: parseFloat(attraction.coordination.longitude),
              }}
              title={attraction.name}
              description="Tap to see more"
            />
          </MapView>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    height: "100%" ,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  infoCard: {
      position: "absolute",
    bottom: 20,  
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.81)",
    borderRadius: 20,   
    maxHeight: height * 0.4,   // CHANGE FROM 0.3 TO 0.4 (make it bigger)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  infoCardContent: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },

  rating: {
    fontSize: 16,
    marginBottom: 10,
  },

  location: {
    fontSize: 13,
    color: "#669b57ff",
    marginBottom: 12,
  },

  description: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },

  readMore: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
    marginTop: 8,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#669b57ff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  mapContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#669b57ff",
    padding: 12,
    borderRadius: 25,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  galleryBtn: {
    backgroundColor: "#669b57ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  galleryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 50, // same level as back button
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
