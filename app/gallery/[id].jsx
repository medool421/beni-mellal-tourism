import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useLocalSearchParams, router } from "expo-router";
import useStore from "../../store/useStore";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.65;

function GalleryCard({ image, index, currentIndex, totalImages, onSwipeLeft, onSwipeRight }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (index === currentIndex) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
        scale.value = 0.95;
      }
    })
    .onEnd((event) => {
      if (index !== currentIndex) return;

      const swipeThreshold = width * 0.3;

      if (event.translationX < -swipeThreshold && currentIndex < totalImages - 1) {
        translateX.value = withTiming(-width * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)();
        });
        translateY.value = withTiming(event.translationY, { duration: 300 });
      } else if (event.translationX > swipeThreshold && currentIndex > 0) {
        translateX.value = withTiming(width * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeRight)();
        });
        translateY.value = withTiming(event.translationY, { duration: 300 });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-30, 0, 30],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.5],
      [1, 0.5],
      Extrapolation.CLAMP
    );

    const indexDiff = index - currentIndex;
    const stackScale = interpolate(
      indexDiff,
      [0, 1, 2, 3],
      [1, 0.95, 0.9, 0.85],
      Extrapolation.CLAMP
    );

    const stackTranslateY = interpolate(
      indexDiff,
      [0, 1, 2, 3],
      [0, -15, -30, -45],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + stackTranslateY },
        { rotate: `${rotate}deg` },
        { scale: scale.value * stackScale },
      ],
      opacity: index === currentIndex ? opacity : 1,
      zIndex: 10 - indexDiff,
    };
  });

  const nextLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-width * 0.3, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const prevLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, width * 0.3],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  if (index < currentIndex || index > currentIndex + 3) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: image }} style={styles.cardImage} />
        
        {index === currentIndex && (
          <>
            <Animated.View style={[styles.nextLabel, nextLabelStyle]}>
              <Text style={styles.labelText}>NEXT →</Text>
            </Animated.View>
            
            <Animated.View style={[styles.prevLabel, prevLabelStyle]}>
              <Text style={styles.labelText}>← PREV</Text>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

export default function Gallery() {
  const { id } = useLocalSearchParams();
  const { attractions } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const attraction = attractions.find((item) => item.id == id);

  if (!attraction || !attraction.images) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No images available</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const images = attraction.images;

  const handleSwipeLeft = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Card Stack Container */}
      <View style={styles.cardContainer}>
        {images.map((image, index) => (
          <GalleryCard
            key={`${index}-${currentIndex}`}
            image={image}
            index={index}
            currentIndex={currentIndex}
            totalImages={images.length}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        ))}
      </View>

      {/* Header - ABOVE cards */}
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </View>

      {/* Bottom Section - ABOVE cards */}
      <View style={styles.bottomSection}>
        <Text style={styles.attractionName}>{attraction.name}</Text>

        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.bottomNav}>
          <Pressable
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navButtonText}>← Previous</Text>
          </Pressable>

          <Pressable
            style={[styles.navButton, currentIndex === images.length - 1 && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={currentIndex === images.length - 1}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: "#669b57ff",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  nextLabel: {
    position: "absolute",
    top: 50,
    left: 30,
    backgroundColor: "rgba(0,255,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: "-15deg" }],
  },
  prevLabel: {
    position: "absolute",
    top: 50,
    right: 30,
    backgroundColor: "rgba(255,165,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: "15deg" }],
  },
  labelText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  closeButton: {
    backgroundColor: "#669b57ff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  counterContainer: {
    backgroundColor: "#669b57ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  counterText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingBottom: 30,
  },
  attractionName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#669b57ff",
    width: 24,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  navButton: {
    backgroundColor: "#669b57ff",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 140,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});