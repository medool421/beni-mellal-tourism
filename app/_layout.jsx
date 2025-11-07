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

    </Stack>);
}
