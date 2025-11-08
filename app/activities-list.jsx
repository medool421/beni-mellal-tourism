import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  FlatList, 
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
  Animated
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import useStore from '../store/useStore';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const SPACING = 20;

export default function ActivitiesList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  // Get data and actions from Zustand store
  const { 
    attractions, 
    favorites, 
    loading, 
    error, 
    fetchAttractions, 
    toggleFavorite, 
    isFavorite 
  } = useStore();

  // Fetch attractions on component mount
  useEffect(() => {
    fetchAttractions();
  }, []);

  const onScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
    );
    setActiveIndex(slideIndex);
  };

  const AnimatedCard = ({ item, index }) => {
    const isFav = isFavorite(item.id);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    const opacity = animatedValue;

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          { transform: [{ scale }], opacity }
        ]}
      >
        <View style={styles.card}>
          {/* Card Image */}
          <Image 
            source={{ uri: item.image }} 
            style={styles.cardImage}
            resizeMode="cover"
          />

          {/* Rating Badge (if available) */}
          {item.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFA500" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}

          {/* Card Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            {/* Favorite Button */}
            <Pressable 
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons 
                name={isFav ? "heart" : "heart-outline"} 
                size={24} 
                color={isFav ? "#FF6B6B" : "#666"} 
              />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderCard = ({ item, index }) => {
    return <AnimatedCard item={item} index={index} />;
  };

  // Loading state
  if (loading && attractions.length === 0) {
    return (
      <ImageBackground
        source={require('../assets/source.jpg')}
        style={styles.container}
        blurRadius={10}
      >
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading attractions...</Text>
        </View>
      </ImageBackground>
    );
  }

  // Error state
  if (error) {
    return (
      <ImageBackground
        source={require('../assets/source.jpg')}
        style={styles.container}
        blurRadius={10}
      >
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={60} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={fetchAttractions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  // Empty state
  if (attractions.length === 0) {
    return (
      <ImageBackground
        source={require('../assets/source.jpg')}
        style={styles.container}
        blurRadius={10}
      >
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Ionicons name="location-outline" size={60} color="#fff" />
          <Text style={styles.errorText}>No attractions found</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/source.jpg')}
      style={styles.container}
      blurRadius={10}
    >
      <StatusBar style="light" />

      {/* Back Button */}
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Beni Mellal</Text>
        <Text style={styles.headerSubtitle}>with us</Text>
      </View>

      {/* Cards Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={attractions}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="normal"
          contentContainerStyle={styles.flatListContent}
        />

        {/* Pagination Dots */}
        {attractions.length > 1 && (
          <View style={styles.pagination}>
            {attractions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex && styles.activeDot
                ]}
              />
            ))}
          </View>
        )}
      </View>

      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 130,
    marginLeft: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000000bf',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000000bf',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  carouselContainer: {
    justifyContent: 'center',
  },
  flatListContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    paddingVertical: 20,
  },
  cardContainer: {
    width: CARD_WIDTH + SPACING,
    paddingHorizontal: SPACING / 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#f0f0f0',
  },
  ratingBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  favoriteButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});