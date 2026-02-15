import { Stack } from 'expo-router';

export default function CompareLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="discoverProducts" />
      <Stack.Screen name="popularComparisons" />
      <Stack.Screen name="savedComparisons" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
