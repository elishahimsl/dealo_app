import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import DealoWordmarkGreenBlack from '../../assets/images/logos/dealo-wordmark-greenblack';

const BG = '#E6FBE6';
const TEXT = '#111827';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Circle cx="330" cy="-40" r="210" fill="#89C745" opacity={0.55} />
        <Circle cx="330" cy="-40" r="150" fill="#0E9F6E" opacity={0.18} />
        <Circle cx="-40" cy="140" r="190" fill="#53982B" opacity={0.2} />
        <Circle cx="90" cy="170" r="165" fill="#89C745" opacity={0.26} />

        <Circle cx="70" cy="820" r="220" fill="#89C745" opacity={0.62} />
        <Circle cx="210" cy="900" r="250" fill="#53982B" opacity={0.55} />
        <Circle cx="300" cy="930" r="220" fill="#0E9F6E" opacity={0.14} />
      </Svg>

      <View style={styles.topRow}>
        <Pressable hitSlop={10} onPress={() => router.canGoBack() && router.back()}>
          <Ionicons name="chevron-back" size={28} color={TEXT} />
        </Pressable>

        <View style={styles.logoWrap}>
          <DealoWordmarkGreenBlack width={118} height={26} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Log In</Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            style={styles.input}
          />

          <Pressable hitSlop={10} onPress={() => {}}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </Pressable>

          <Pressable style={[styles.buttonBase, styles.primary]} onPress={() => router.replace('/(onboarding)/suggestions' as Href)}>
            <Text style={[styles.buttonText, styles.primaryText]}>Log in</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={[styles.buttonBase, styles.social]} onPress={() => {}}>
            <Ionicons name="logo-apple" size={22} color="#111111" style={styles.socialIcon} />
            <Text style={[styles.buttonText, styles.socialText]}>Log in using Apple</Text>
          </Pressable>

          <Pressable style={[styles.buttonBase, styles.social]} onPress={() => {}}>
            <Ionicons name="logo-google" size={20} color="#111111" style={styles.socialIcon} />
            <Text style={[styles.buttonText, styles.socialText]}>Log in using Google</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={styles.progressFillSpacer} />
          <View style={styles.progressFill} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 6,
    height: 56,
    justifyContent: 'space-between',
  },
  logoWrap: {
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 22,
  },
  form: {
    gap: 14,
  },
  input: {
    height: 56,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6B7280',
    paddingHorizontal: 16,
    fontSize: 15,
    color: TEXT,
  },
  forgot: {
    marginTop: -6,
    fontSize: 12,
    color: TEXT,
    fontWeight: '500',
    opacity: 0.95,
  },
  buttonBase: {
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#2F2F2F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
    marginTop: 8,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  dividerLine: {
    height: 3,
    backgroundColor: '#111111',
    flex: 1,
    borderRadius: 999,
    opacity: 0.95,
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 12,
    fontWeight: '600',
    color: TEXT,
    opacity: 0.8,
  },
  social: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111111',
    justifyContent: 'center',
  },
  socialIcon: {
    position: 'absolute',
    left: 18,
  },
  socialText: {
    color: '#111111',
  },
  progressWrap: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  progressTrack: {
    width: 220,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#C7C7C7',
    overflow: 'hidden',
    opacity: 0.85,
    flexDirection: 'row',
  },
  progressFillSpacer: {
    flex: 1,
  },
  progressFill: {
    width: 76,
    height: '100%',
    backgroundColor: '#111111',
  },
});
