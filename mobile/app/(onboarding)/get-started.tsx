
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import DealoWordmarkWhite from '../../assets/images/logos/dealo-wordmark-white';

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View pointerEvents="none" style={styles.bgCircleTopLeft} />
      <View pointerEvents="none" style={styles.bgCircleBottomRight} />

      <View style={styles.content}>
        <View style={styles.brandGroup}>
          <View style={styles.brandContainer}>
            <DealoWordmarkWhite width={250} height={50} color="#FFFFFF" />
          </View>

          <Text style={styles.tagline}>Shop Smart Save Big</Text>
        </View>

        <View style={styles.ctaShadow}>
          <Pressable
            style={({ pressed, hovered }) => [styles.cta, (pressed || hovered) && styles.ctaPressed]}
            onPress={() => router.replace('/(onboarding)/create-account' as Href)}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </Pressable>
        </View>

        <Pressable hitSlop={10} onPress={() => router.replace('/(onboarding)/login' as Href)}>
          <Text style={styles.alreadyText}>I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1e2c11ff',
    overflow: 'hidden',
  },
  bgCircleTopLeft: {
    position: 'absolute',
    width: 580,
    height: 580,
    borderRadius: 560 / 2,
    top: -330,
    left: -250,
    backgroundColor: '#89C745',
  },
  bgCircleBottomRight: {
    position: 'absolute',
    width: 580,
    height: 580,
    borderRadius: 560 / 2,
    bottom: -320,
    right: -250,
    backgroundColor: '#53982B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandGroup: {
    alignItems: 'center',
    transform: [{ translateY: -5 }],
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.92,
    marginBottom: 10,
  },
  cta: {
    height: 45,
    paddingHorizontal: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(115,207,62,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(137,199,69,0.3)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaShadow: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  alreadyText: {
    marginTop: 16,
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.92,
  },
});

