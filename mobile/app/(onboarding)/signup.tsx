import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

const BG = '#EDFFE8';
const TEXT = '#111827';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canContinue = email.trim().length > 0 && password.trim().length > 0;

  const maskedEmail = useMemo(() => {
    if (!email) return 'e------@gmail.com';
    const [u, d] = email.split('@');
    if (!d) return 'e------@gmail.com';
    const head = u.slice(0, 1) || 'e';
    return `${head}${'-'.repeat(Math.max(1, Math.min(6, u.length - 1)))}@${d}`;
  }, [email]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.topRow}>
        <Pressable hitSlop={10} onPress={() => router.replace('/(onboarding)/create-account' as Href)}>
          <Ionicons name="chevron-back" size={22} color={TEXT} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Sign up</Text>

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

          <Pressable
            style={[styles.buttonBase, styles.primary, !canContinue && styles.primaryDisabled]}
            disabled={!canContinue}
            onPress={() => {
              if (!canContinue) return;
              router.replace({ pathname: '/(onboarding)/verify-email', params: { email: maskedEmail } } as unknown as Href);
            }}
          >
            <Text style={[styles.buttonText, styles.primaryText]}>Continue</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={[styles.buttonBase, styles.secondary]} onPress={() => {}}>
            <Text style={[styles.buttonText, styles.secondaryText]}>Continue with Apple</Text>
          </Pressable>
          <Pressable
            style={[styles.buttonBase, styles.secondary]}
            onPress={() => WebBrowser.openBrowserAsync('https://accounts.google.com/signin/v2/identifier?prompt=select_account')}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>Continue with Google</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
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
    height: 44,
    justifyContent: 'space-between',
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
    marginBottom: 18,
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
  },
  primaryDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  secondaryText: {
    color: '#111111',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  dividerLine: {
    height: 2,
    backgroundColor: '#C7B3FF',
    flex: 1,
    opacity: 0.45,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    color: TEXT,
    opacity: 0.55,
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
  },
  progressFill: {
    width: 70,
    height: '100%',
    backgroundColor: '#111111',
  },
});
