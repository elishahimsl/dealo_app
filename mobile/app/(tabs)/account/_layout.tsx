import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="manageAccount" />
      <Stack.Screen name="premium" />
      <Stack.Screen name="insights" />
      <Stack.Screen name="recents" />
      <Stack.Screen name="contactSupport" />
      <Stack.Screen name="customerFeedback" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/about" />
      <Stack.Screen name="settings/preferences" />
      <Stack.Screen name="settings/accountLogin" />
      <Stack.Screen name="settings/privacy" />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="settings/appearance/index" />
      <Stack.Screen name="settings/helpCenter" />
      <Stack.Screen name="benefits/invite" />
      <Stack.Screen name="benefits/redeemRewards" />
      <Stack.Screen name="benefits/badges" />
    </Stack>
  );
}
