import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#E6FBE6';
const TEXT = '#111827';

export default function SuccessScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.topRow}>
        <Pressable hitSlop={10} onPress={() => router.canGoBack() && router.back()}>
          <Ionicons name="chevron-back" size={22} color={TEXT} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Sign up</Text>

        <View style={styles.verifiedWrap}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={16} color={TEXT} />
          </View>
          <Text style={styles.verifiedText}>Account Verified</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={styles.input}
          />
          <Text style={styles.forgot}>Forgot Password?</Text>

          <Pressable style={[styles.buttonBase, styles.primary]} onPress={() => router.replace('/(onboarding)/suggestions' as Href)}>
            <Text style={[styles.buttonText, styles.primaryText]}>Register</Text>
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
    paddingHorizontal: 18,
    paddingTop: 6,
    height: 44,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 10,
  },
  verifiedWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT,
    opacity: 0.85,
  },
  form: {
    gap: 12,
  },
  input: {
    height: 46,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    fontSize: 14,
    color: TEXT,
  },
  forgot: {
    marginTop: -4,
    fontSize: 12,
    color: TEXT,
    opacity: 0.85,
    fontWeight: '500',
  },
  buttonBase: {
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#111111',
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
    fontSize: 14,
    fontWeight: '700',
  },
  progressWrap: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  progressTrack: {
    width: 210,
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
    width: 70,
    height: '100%',
    backgroundColor: '#111111',
  },
});
