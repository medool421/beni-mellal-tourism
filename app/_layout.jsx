import { Stack } from 'expo-router';

export default function StackLayout() {
  return ( <Stack>
    <Stack.Screen
        name="index"
        options={{
          title: "Beni Mellal Tourism",
          headerShown: false,
        }}
      />
    <Stack.Screen
        name="city-details"
        options={{
          headerShown: false,
        }}
        />
    <Stack.Screen
        name="activities-list"
        options={{
          headerShown: false,
        }}
      />
    </Stack>);
}
