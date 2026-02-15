import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="deals/index" />
      <Stack.Screen name="following/index" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="saved/index" />
    </Stack>
  );
}
