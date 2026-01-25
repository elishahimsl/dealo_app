
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
 import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import DealoMarkWhite from '../../assets/images/logos/dealo-mark-white';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/(onboarding)/get-started' as Href);
    }, 900);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="splashBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#89C745" />
            <Stop offset="1" stopColor="#53982B" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#splashBg)" />
      </Svg>
      <View style={styles.center}>
        <View style={styles.logoShadow}>
          <DealoMarkWhite width={118} height={130} />
        </View>
        <Text style={styles.wordmark}>dealo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  wordmark: {
    marginTop: 18,
    fontSize: 54,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
});

