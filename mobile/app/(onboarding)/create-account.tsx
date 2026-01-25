import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DealoMarkGreen from '../../assets/images/logos/dealo-mark-green';

const BG = '#E6FBE6';
const TEXT = '#111827';
const GREEN = '#0E9F6E';

export default function CreateAccountScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Pressable hitSlop={10} onPress={() => router.replace('/(tabs)/home' as Href)}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.logoShadow}>
          <DealoMarkGreen width={118} height={128} />
        </View>

        <Text style={styles.headline}>
          Snap. Compare. <Text style={styles.headlineAccent}>Save!</Text>
        </Text>

        <View style={styles.subheadWrap}>
          <Text style={styles.subhead}>Find the best deals for the</Text>
          <Text style={styles.subhead}>products you love</Text>
        </View>

        <View style={styles.ctaWrap}>
          <Pressable style={[styles.buttonBase, styles.primary]} onPress={() => router.push('/(onboarding)/signup' as Href)}>
            <Text style={[styles.buttonText, styles.primaryText]}>Sign up</Text>
          </Pressable>

          <Pressable style={[styles.buttonBase, styles.secondary]} onPress={() => router.push('/(onboarding)/login' as Href)}>
            <Text style={[styles.buttonText, styles.secondaryText]}>Log in</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Help | Terms</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.3,
  },
  skip: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT,
    opacity: 0.75,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadow: {
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 7,
  },
  headline: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.2,
  },
  headlineAccent: {
    color: GREEN,
  },
  subheadWrap: {
    marginTop: 14,
    alignItems: 'center',
  },
  subhead: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: TEXT,
    opacity: 0.85,
    lineHeight: 20,
  },
  ctaWrap: {
    width: '100%',
    marginTop: 40,
    gap: 12,
  },
  buttonBase: {
    height: 46,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#111111',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
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
  footer: {
    paddingBottom: 14,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT,
    opacity: 0.55,
  },
});
