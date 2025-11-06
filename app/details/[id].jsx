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
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useStore from "../../store/useStore";

const { width, height } = Dimensions.get("window");

export default function Details() {
  const { id } = useLocalSearchParams();
  const { attractions, loading, fetchAttractions } = useStore();
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!attractions || attractions.length === 0) {
      fetchAttractions();
    }
  }, []);

  const attraction = attractions.find((item) => item.id == id);

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
        <Text>Attraction not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: attraction.thumbnail }}
          style={styles.heroImage}
        />

        <ScrollView
          style={styles.infoCard}
          contentContainerStyle={styles.infoCardContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{attraction.name}</Text>

          <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>

          <Text style={styles.location}>
            📍 {attraction.coordination?.latitude},{" "}
            {attraction.coordination?.longitude}
          </Text>

          <Text
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {attraction.description}
          </Text>
          <Pressable
            onPress={() => setShowFullDescription(!showFullDescription)}
          >
            <Text style={styles.readMore}>
              {showFullDescription ? "Read less" : "Read more"}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: height * 0.6,
    position: "relative",
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoCard: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    maxHeight: height * 0.3,
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
    color: "#666",
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
});
