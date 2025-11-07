import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet , ActivityIndicator } from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";



export default function Home() {
  const router = useRouter();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=32.3373&longitude=-6.3498&current_weather=true&timezone=auto'
      );
      const data = await response.json();
      setWeather(data.current_weather);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  return (
    <View >
    <StatusBar style="light"  />
    <ImageBackground
        source={require('../assets/source.jpg')} 
        style={styles.headerImage}
        resizeMode="cover">

    <Pressable 
        style={styles.backButton}
        onPress={() => router.push("/")} 
        >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <View style={styles.weatherContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : weather ? (
          <View style={styles.weatherInfo}>
            
            <Text style={styles.weatherTemp}><Ionicons name="sunny" size={24} color="#fff" /> {Math.round(weather.temperature)}°C</Text>
          </View>
        ) : (
          <Text style={styles.weatherError}>Weather unavailable</Text>
        )}
      </View>
        </ImageBackground>

      <View style={styles.contentCard}>
        <Text style={styles.title}>Beni Mellal</Text>
        <Text style={styles.description}>
          Exploring the rich history, stunning landscapes, and hidden treasures of Morocco's bountiful heartland.
        </Text>

        <Text style={styles.locationTitle}>Location :</Text>

              <View style={styles.container}>
<MapView
  style={{flex:1}}
  mapType="standard"
  
  initialRegion={{
    latitude: 32.3373,
    longitude: -6.3498,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker
    coordinate={{ latitude: 32.3373, longitude: -6.3498 }}
    title="Beni Mellal"
    description="Morocco's bountiful heartland"
  />
</MapView>
        
        </View>
        <Pressable style={styles.exploreButton}
        onPress={() => router.push("/activities-list")} >
          <Text style={styles.exploreButtonText}>Explore more</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>

    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: '87%', 
    height: 220, 
    borderRadius: 20, 
    overflow: 'hidden',
    alignSelf:"center",
  
    borderWidth:2,
    borderColor:"#00000086",


  },
  headerImage: {
    height: 280,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 30,
    zIndex: 10,
    backgroundColor: '#0000009c',
    width: 55,
    height: 55,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
weatherContainer: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
    backgroundColor: '#0000009c',
    padding: 15,
    borderRadius: 30,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherError: {
    color: '#fff',
    fontSize: 12,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
    height:"100%",
    width:"100%",
    borderWidth:5,
    borderColor:"#12550c83",
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    fontFamily: 'inter',
    textAlign: 'center',
    marginBottom: 20,
    color: '#056816ff',
  },
  description: {
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 30,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 25,
    fontWeight:"bold",
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a1a1aff',
  },
exploreButton: {
    backgroundColor: '#2d4a2b',
  paddingVertical: 15,
    paddingHorizontal: 105,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'center',
    marginTop:35,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});