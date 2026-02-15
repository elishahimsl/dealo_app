import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Animated, Text, TextInput } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const MANROPE_FONTS = {
  'Manrope-Regular': require('../assets/fonts/Manrope-Regular.ttf'),
  'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
  'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
};

const ICON_FONT_FAMILIES = new Set(['Ionicons']);

function getFontWeight(style: any): string | undefined {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    for (let i = style.length - 1; i >= 0; i -= 1) {
      const v = getFontWeight(style[i]);
      if (v) return v;
    }
    return undefined;
  }
  return style?.fontWeight;
}

function getFontFamily(style: any): string | undefined {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    for (let i = style.length - 1; i >= 0; i -= 1) {
      const v = getFontFamily(style[i]);
      if (v) return v;
    }
    return undefined;
  }
  return style?.fontFamily;
}

function pickManropeFamily(fontWeight?: string) {
  const w = Number(fontWeight);
  if (!Number.isNaN(w)) {
    if (w >= 700) return 'Manrope-Bold';
    if (w >= 600) return 'Manrope-SemiBold';
    if (w >= 500) return 'Manrope-SemiBold';
    return 'Manrope-Regular';
  }

  if (fontWeight === 'bold') return 'Manrope-Bold';
  return 'Manrope-Regular';
}

const TextRender = (Text as any).render;
if (TextRender && !(Text as any).__manropePatched) {
  (Text as any).__manropePatched = true;
  (Text as any).render = function render(...args: any[]) {
    const origin = TextRender.call(this, ...args);
    const propsStyle = origin?.props?.style;
    const existingFamily = getFontFamily(propsStyle);
    if (existingFamily && ICON_FONT_FAMILIES.has(existingFamily)) return origin;

    const weight = getFontWeight(propsStyle);
    const family = pickManropeFamily(weight);

    return React.cloneElement(origin, {
      style: [origin.props.style, { fontFamily: family, fontWeight: undefined }],
    });
  };
}

const baseTextInputProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps = {
  ...baseTextInputProps,
  style: [baseTextInputProps.style, { fontFamily: 'Manrope-Regular' }],
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const fade = React.useRef(new Animated.Value(1)).current;

  const [fontsLoaded, fontError] = useFonts(MANROPE_FONTS);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    fade.stopAnimation();
    fade.setValue(0.92);
    Animated.timing(fade, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [colorScheme, fade]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Animated.View style={{ flex: 1, opacity: fade }}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </Animated.View>
    </ThemeProvider>
  );
}

