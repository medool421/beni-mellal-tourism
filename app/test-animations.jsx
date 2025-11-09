import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

export default function TestAnimations() {
  const [liked1, setLiked1] = useState(false);
  const [liked2, setLiked2] = useState(false);
  const [liked3, setLiked3] = useState(false);
  
  // ANIMATION 1: FLIP & SPIN
  const flipRotation = useSharedValue(0);
  const flipScale = useSharedValue(1);
  const flipOpacity = useSharedValue(1);
  
  const handleFlip = () => {
    flipRotation.value = withSequence(
      withTiming(180, { duration: 300 }),
      withTiming(360, { duration: 300 })
    );
    flipScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
    flipOpacity.value = withSequence(
      withTiming(0.5, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    setTimeout(() => {
      flipRotation.value = 0;
      setLiked1(!liked1);
    }, 600);
  };
  
  const animatedFlipStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${flipRotation.value}deg` },
        { scale: flipScale.value },
      ],
      opacity: flipOpacity.value,
    };
  });
  
  // ANIMATION 2: WIGGLE & BOUNCE
  const wiggleRotation = useSharedValue(0);
  const wiggleScale = useSharedValue(1);
  
  const handleWiggle = () => {
    wiggleRotation.value = withSequence(
      withTiming(-15, { duration: 50 }),
      withTiming(15, { duration: 100 }),
      withTiming(-10, { duration: 80 }),
      withTiming(0, { duration: 50 })
    );
    wiggleScale.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withSpring(1.3, { damping: 5 }),
      withSpring(1, { damping: 10 })
    );
    setLiked2(!liked2);
  };
  
  const animatedWiggleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: wiggleScale.value },
        { rotate: `${wiggleRotation.value}deg` },
      ],
    };
  });
  
  // ANIMATION 3: PULSE & GLOW
  const pulseScale = useSharedValue(1);
  
  const handlePulse = () => {
    pulseScale.value = withSequence(
      withSpring(1.5, { damping: 3 }),
      withSpring(0.9, { damping: 8 }),
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 12 })
    );
    setLiked3(!liked3);
  };
  
  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test Heart Animations</Text>
      <Text style={styles.subtitle}>Tap each heart to test!</Text>
      
      {/* Animation 1 */}
      <View style={styles.testSection}>
        <Text style={styles.label}>1. Flip & Spin (3D) </Text>
        <Text style={styles.description}>Heart flips like a coin</Text>
        <Pressable onPress={handleFlip}>
          <Animated.View style={[styles.heartButton, animatedFlipStyle]}>
            <AntDesign 
              name={liked1 ? "heart" : "heart"} 
              size={35} 
              color={liked1 ? "#FF0000" : "#669b57ff"} 
            />
          </Animated.View>
        </Pressable>
      </View>
      
      {/* Animation 2 */}
      <View style={styles.testSection}>
        <Text style={styles.label}>2. Wiggle & Bounce</Text>
        <Text style={styles.description}>Heart wiggles left-right</Text>
        <Pressable onPress={handleWiggle}>
          <Animated.View style={[styles.heartButton, animatedWiggleStyle]}>
            <AntDesign 
              name={liked2 ? "heart" : "heart"} 
              size={35} 
              color={liked2 ? "#FF0000" : "#669b57ff"} 
            />
          </Animated.View>
        </Pressable>
      </View>
      
      {/* Animation 3 */}
      <View style={styles.testSection}>
        <Text style={styles.label}>3. Pulse & Glow </Text>
        <Text style={styles.description}>Heart pulses smoothly</Text>
        <Pressable onPress={handlePulse}>
          <Animated.View style={[styles.heartButton, animatedPulseStyle]}>
            <AntDesign 
              name={liked3 ? "heart" : "heart"} 
              size={35} 
              color={liked3 ? "#FF0000" : "#669b57ff"} 
            />
          </Animated.View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  testSection: {
    marginBottom: 50,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  heartButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});