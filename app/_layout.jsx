import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ADD THIS

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <Stack>
        <Stack.Screen name="index" options={{ title: "Attractions" }} />
        <Stack.Screen name="details/[id]" options={{ title: "Details" }} />
        <Stack.Screen name="gallery/[id]" options={{ title: "Gallery" }} />
        <Stack.Screen name="test-animations" options={{ title: "Test" }} />
      </Stack>
    </GestureHandlerRootView> 
  );
}
