import React, { useCallback, useState } from 'react';
import { Alert, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

const BRAND_GREEN = '#0E9F6E';
const FONT_REGULAR = 'Manrope-Regular';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

const REFERRAL_CODE = 'DEALO-7KX2';
const REFERRAL_LINK = `https://dealo.app/invite/${REFERRAL_CODE}`;

const STEPS = [
  { num: '1', text: 'Share your link with a friend' },
  { num: '2', text: 'They join DeaLo using your link' },
  { num: '3', text: 'You both earn 50 pts' },
];

function StepRow({ num, text, isLast }: { num: string; text: string; isLast: boolean }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepLeft}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNum}>{num}</Text>
        </View>
        {!isLast && <View style={styles.stepLine} />}
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

export default function InviteScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const friendsInvited = 0;
  const ptsEarned = 0;

  const onCopyCode = useCallback(async () => {
    await Clipboard.setStringAsync(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Join me on DeaLo and we both get 50 pts! Use my code ${REFERRAL_CODE} or tap: ${REFERRAL_LINK}`,
      });
    } catch (_) {}
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Invite & Earn</Text>
          </View>
          <View style={styles.headerBtn} />
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Ionicons name="people-outline" size={44} color={BRAND_GREEN} />
          </View>
          <Text style={styles.heroHeadline}>Give 50 pts, Get 50 pts</Text>
          <Text style={styles.heroSubtitle}>
            Share your code with friends. When they join DeaLo, you both earn rewards.
          </Text>
        </View>

        {/* Referral Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your referral code</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeText}>{REFERRAL_CODE}</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.copyBtn} onPress={onCopyCode}>
              <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color="#FFFFFF" />
              <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Buttons */}
        <View style={styles.shareRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.shareBtn} onPress={onShare}>
            <View style={[styles.shareIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="chatbubble-outline" size={20} color={BRAND_GREEN} />
            </View>
            <Text style={styles.shareBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.shareBtn} onPress={onShare}>
            <View style={[styles.shareIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <Text style={styles.shareBtnText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.shareBtn} onPress={onCopyCode}>
            <View style={[styles.shareIcon, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="link-outline" size={20} color="#111827" />
            </View>
            <Text style={styles.shareBtnText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.shareBtn} onPress={onShare}>
            <View style={[styles.shareIcon, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#111827" />
            </View>
            <Text style={styles.shareBtnText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* How It Works */}
        <View style={styles.howBlock}>
          <Text style={styles.howTitle}>How it works</Text>
          {STEPS.map((s, i) => (
            <StepRow key={s.num} num={s.num} text={s.text} isLast={i === STEPS.length - 1} />
          ))}
        </View>

        {/* Stats Strip */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{friendsInvited}</Text>
            <Text style={styles.statLabel}>Friends invited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{ptsEarned}</Text>
            <Text style={styles.statLabel}>Pts earned</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  headerRow: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },

  /* Hero */
  heroWrap: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  heroCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },

  /* Code Card */
  codeCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 10,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },

  /* Share Buttons */
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  shareBtn: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  shareIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },

  /* How It Works */
  howBlock: {
    marginBottom: 24,
  },
  howTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 48,
  },
  stepLeft: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D1FAE5',
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingTop: 4,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },

  /* Stats */
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
});