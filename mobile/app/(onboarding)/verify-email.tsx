import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#E6FBE6';
const TEXT = '#111827';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const email = useMemo(() => {
    const e = params.email;
    if (!e) return 'e------@gmail.com';
    if (Array.isArray(e)) return e[0] ?? 'e------@gmail.com';
    return e;
  }, [params.email]);

  const [code, setCode] = useState(['', '', '', '', '']);
  const refs = useRef<Array<TextInput | null>>([]);

  const onChange = (idx: number, v: string) => {
    const next = v.replace(/\D/g, '').slice(-1);
    setCode((prev) => {
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
    if (next && idx < 4) refs.current[idx + 1]?.focus();
  };

  const onKeyPress = (idx: number, key: string) => {
    if (key === 'Backspace' && !code[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.topRow}>
        <Pressable hitSlop={10} onPress={() => router.canGoBack() && router.back()}>
          <Ionicons name="chevron-back" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.topTitle}>Confirm Email</Text>
        <View style={styles.topRightSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>Enter the verification code we sent to</Text>
          <Text style={styles.instructionText}>{email}</Text>
        </View>

        <View style={styles.otpRow}>
          {code.map((v, idx) => {
            const active = idx === 0 ? '#111111' : '#BDBDBD';
            return (
              <TextInput
                key={idx}
                ref={(r) => {
                  refs.current[idx] = r;
                }}
                value={v}
                onChangeText={(t) => onChange(idx, t)}
                keyboardType="number-pad"
                maxLength={1}
                style={[styles.otpBox, { borderColor: idx === 0 ? active : '#BDBDBD' }]}
                onKeyPress={({ nativeEvent }) => onKeyPress(idx, nativeEvent.key)}
                autoFocus={idx === 0}
              />
            );
          })}
        </View>

        <Pressable hitSlop={10} onPress={() => {}} style={styles.resendWrap}>
          <Text style={styles.resend}>Resend code</Text>
        </Pressable>
      </View>

      <View style={styles.middleProgressWrap}>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable style={[styles.buttonBase, styles.primary]} onPress={() => router.replace('/(onboarding)/success' as Href)}>
          <Text style={[styles.buttonText, styles.primaryText]}>Confirm</Text>
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },
  topRightSpacer: {
    width: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  instructions: {
    gap: 6,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT,
    opacity: 0.9,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  otpBox: {
    width: 52,
    height: 56,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: BG,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },
  resendWrap: {
    marginTop: 12,
  },
  resend: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  middleProgressWrap: {
    alignItems: 'center',
    paddingBottom: 14,
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
  bottom: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  buttonBase: {
    height: 46,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2A2A2A',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
