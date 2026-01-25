
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import DealoWordmarkWhite from '../../assets/images/logos/dealo-wordmark-white';

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.bgCircleTopLeft} />
      <View style={styles.bgCircleBottomRight}>
        <View style={styles.bgCircleBottomRightOverlay} />
      </View>

      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <DealoWordmarkWhite width={200} height={43} />
        </View>

        <Text style={styles.tagline}>Shop Smart Save Big</Text>

        <View style={styles.ctaShadow}>
          <Pressable style={styles.cta} onPress={() => router.push('/(onboarding)/create-account' as Href)}>
            <Svg
              pointerEvents="none"
              style={StyleSheet.absoluteFillObject}
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id="ctaBg" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#89C745" />
                  <Stop offset="0.5" stopColor="#6EBF35" />
                  <Stop offset="1" stopColor="#53982B" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100" height="100" fill="url(#ctaBg)" />
            </Svg>
            <Text style={styles.ctaText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1B2618',
    overflow: 'hidden',
  },
  bgCircleTopLeft: {
    position: 'absolute',
    width: 640,
    height: 640,
    borderRadius: 640 / 2,
    backgroundColor: '#89C745',
    top: -360,
    left: -360,
  },
  bgCircleBottomRight: {
    position: 'absolute',
    width: 640,
    height: 640,
    borderRadius: 640 / 2,
    backgroundColor: '#89C745',
    overflow: 'hidden',
    bottom: -360,
    right: -360,
  },
  bgCircleBottomRightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#53982B',
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 26,
  },
  cta: {
    height: 44,
    paddingHorizontal: 26,
    borderRadius: 6,
    backgroundColor: '#53982B',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaShadow: {
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

