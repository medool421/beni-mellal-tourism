import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Home() {
  return (
    <GestureHandlerRootView>
    <View style={{    backgroundColor:"black"}}>
    <StatusBar style="light"  />
    
              <ImageBackground source={require('../assets/home.png')} resizeMode="cover" style={{ width: '100%', height: '100%',}}>
              <View style={{ marginTop:575}}>
              <Text style={{color: '#202020ff', textAlign: "center", fontWeight:"900",fontSize:32, textShadowColor: "#00000046",textShadowOffset: { width: -2, height: 2 },textShadowRadius: 20}}>Discover Your Next</Text>
              <Text style={{color: '#2d4a2b', textAlign: "center", fontWeight:"900",fontSize:32, textShadowColor: "#0000005d",textShadowOffset: { width: -2, height: 2 },textShadowRadius: 21}}>Adventure</Text>
              <Text style={{color: '#2d4a2b', textAlign: "center", paddingHorizontal:20, paddingVertical:20, fontWeight:"700",lineHeight:30,fontSize:20, textShadowColor: "white",textShadowOffset: { width: -2, height: 2 },textShadowRadius: 2}}>Explore breathtaking destinations, find hidden gems, and plan unforgettable journeys. Start your adventure today!</Text>
              </View>
              <View style={styles.container}>

        <Pressable style={styles.button}>
      <Link href="/city-details">
                <Text style={styles.buttonText}>Get Started</Text>
          </Link>
            </Pressable>
        </View>
      </ImageBackground>
    </View>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 135,
    borderRadius: 16,
    backgroundColor:"#2d4a2b",
    elevation:3,

  },
  buttonText: {
    color: "white",
    fontWeight:"600",
    fontSize: 17,
  },
});
