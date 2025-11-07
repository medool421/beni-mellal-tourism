import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#669b57ff",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ title: "Beni Mellal Tourism" }} 
        />
        <Stack.Screen 
          name="details/[id]" 
          options={{ 
            title: "Details",
            headerShown: false // Hide header on details since you have custom back button
          }} 
        />
        <Stack.Screen 
          name="gallery/[id]" 
          options={{ 
            title: "Gallery",
            headerShown: false // Hide header on gallery since you have custom close button
          }} 
        />
        <Stack.Screen 
          name="test-animations" 
          options={{ title: "Test Animations" }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}