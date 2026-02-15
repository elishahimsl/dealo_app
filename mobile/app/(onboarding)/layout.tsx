// app/(onboarding)/layout.tsx
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="splash" options={{ animation: 'none' }} />
      <Stack.Screen name="get-started" options={{ animation: 'none' }} />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="success" />
      <Stack.Screen name="suggestions" />
    </Stack>
  );
}