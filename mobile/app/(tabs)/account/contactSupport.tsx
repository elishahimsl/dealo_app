import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';

const FONT_REGULAR = 'Manrope-Regular';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

type IssueKey = 'link' | 'price' | 'bug' | 'saved' | 'feature' | 'other';

const ISSUE_TYPES: { key: IssueKey; label: string }[] = [
  { key: 'link', label: 'Product link not working' },
  { key: 'price', label: 'Price looks wrong' },
  { key: 'bug', label: 'App bug or crash' },
  { key: 'saved', label: 'Saved / Compare issue' },
  { key: 'feature', label: 'Feature not working' },
  { key: 'other', label: 'Other' },
];

function SuggestionRow({ text, onPress }: { text: string; onPress?: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.suggestionRow} onPress={onPress}>
      <Text style={styles.suggestionText}>{text}</Text>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function ContactSupportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ productName?: string; store?: string }>();

  const [issue, setIssue] = useState<IssueKey>('bug');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [screenshotAttached, setScreenshotAttached] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const suggestions = useMemo(() => {
    if (issue === 'price') {
      return ['Check price history to confirm changes', 'Refresh results and try again', 'Try scanning again for an updated match'];
    }
    if (issue === 'link') {
      return ['Try refreshing the product page', 'Try another store option if available', 'Check if the seller link changed'];
    }
    if (issue === 'saved') {
      return ['Try saving again after reopening the app', 'Check if you are viewing the correct filter', 'Try comparing again from Discover Products'];
    }
    if (issue === 'feature') {
      return ['Make sure you are on the latest app version', 'Force close and reopen the app', 'Try again on a different network'];
    }
    if (issue === 'bug') {
      return ['Force close and reopen the app', 'Try again on a different network', 'Restart your device and retry'];
    }
    return ['Try refreshing and retrying the action', 'Force close and reopen the app', 'If it persists, send this report'];
  }, [issue]);

  const hasContext = Boolean((params.productName ?? '').toString().trim() || (params.store ?? '').toString().trim());

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Contact Support</Text>
          </View>
          <View style={styles.headerBtn} />
        </View>

        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Message sent</Text>
          <Text style={styles.successBody}>Our team is looking into it. We usually reply within 24 hours.</Text>

          <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn} onPress={() => router.push('/(tabs)/home' as Href)}>
            <Text style={styles.primaryBtnText}>Go home</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.secondaryBtn} onPress={() => router.back()}>
            <Text style={styles.secondaryBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Contact Support</Text>
          </View>
          <View style={styles.headerBtn} />
        </View>

        <Text style={styles.subtext}>Something not working? We will help you fix it.</Text>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>What do you need help with?</Text>
          <View style={styles.pillsWrap}>
            {ISSUE_TYPES.map((t) => {
              const active = t.key === issue;
              return (
                <TouchableOpacity
                  key={t.key}
                  activeOpacity={0.9}
                  onPress={() => setIssue(t.key)}
                  style={[styles.pill, active ? styles.pillActive : null]}
                >
                  <Text style={[styles.pillText, active ? styles.pillTextActive : null]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {hasContext ? (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Attached context</Text>
            <View style={styles.contextCard}>
              <View style={styles.contextLeft}>
                <View style={styles.contextIcon}>
                  <Ionicons name="pricetag" size={16} color={BRAND_GREEN} />
                </View>
                <View style={styles.contextTextCol}>
                  {(params.productName ?? '').toString().trim() ? (
                    <Text style={styles.contextTitle} numberOfLines={1}>
                      {(params.productName ?? '').toString()}
                    </Text>
                  ) : null}
                  {(params.store ?? '').toString().trim() ? (
                    <Text style={styles.contextSubtitle} numberOfLines={1}>
                      {(params.store ?? '').toString()}
                    </Text>
                  ) : null}
                  <Text style={styles.contextHint}>Attached automatically</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.block}>
          <Text style={styles.blockTitle}>What is going on?</Text>
          <View style={styles.textAreaWrap}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us what happened. Screenshots help if something looks off."
              placeholderTextColor="#9CA3AF"
              multiline
              style={styles.textArea}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.attachBtn, screenshotAttached ? styles.attachBtnActive : null]}
              onPress={() => setScreenshotAttached((v) => !v)}
            >
              <Ionicons name="attach" size={16} color={screenshotAttached ? '#FFFFFF' : '#111827'} />
              <Text style={[styles.attachText, screenshotAttached ? styles.attachTextActive : null]}>
                {screenshotAttached ? 'Screenshot attached' : 'Attach screenshot'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>This might help first</Text>
          <View style={styles.suggestionsCard}>
            {suggestions.map((s, idx) => (
              <View key={`${issue}-s-${idx}`}>
                <SuggestionRow text={s} onPress={() => {}} />
                {idx !== suggestions.length - 1 ? <View style={styles.suggestionDivider} /> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Email</Text>
          <Text style={styles.helperText}>We will reply here</Text>
          <View style={styles.inputWrap}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn} onPress={() => setSubmitted(true)}>
          <Text style={styles.primaryBtnText}>Send to Support</Text>
        </TouchableOpacity>
        <Text style={styles.afterSubmitHint}>We usually reply within 24 hours.</Text>

        <View style={{ height: 28 }} />
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
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  subtext: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  block: {
    marginBottom: 18,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  helperText: {
    marginTop: -6,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
  },
  pillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  contextCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    padding: 12,
  },
  contextLeft: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  contextIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextTextCol: {
    flex: 1,
  },
  contextTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  contextSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  contextHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  textAreaWrap: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    padding: 12,
  },
  textArea: {
    minHeight: 110,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_REGULAR,
  },
  attachBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  attachBtnActive: {
    backgroundColor: '#111827',
  },
  attachText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  attachTextActive: {
    color: '#FFFFFF',
  },
  suggestionsCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionText: {
    flex: 1,
    marginRight: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  suggestionDivider: {
    height: 1,
    backgroundColor: 'rgba(17,24,39,0.06)',
    marginLeft: 12,
  },
  inputWrap: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_REGULAR,
  },
  primaryBtn: {
    marginTop: 6,
    height: 50,
    borderRadius: 14,
    backgroundColor: BRAND_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  afterSubmitHint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  successWrap: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 48,
  },
  successIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BRAND_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  successBody: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 18,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  secondaryBtn: {
    marginTop: 10,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
});
