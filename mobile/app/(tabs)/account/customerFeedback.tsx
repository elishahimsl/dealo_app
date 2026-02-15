
import React, { useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';

const FONT_REGULAR = 'Manrope-Regular';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

export default function CustomerFeedbackScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [subjectOpen, setSubjectOpen] = useState(false);

  const subjectSuggestions = useMemo(
    () => ['Bugs', 'Feature request', 'Deals page', 'Account', 'Scanning', 'Premium'] as const,
    []
  );

  const onPressSubmit = () => {
    const s = subject.trim();
    const m = message.trim();

    if (!s || !m) {
      Alert.alert('Missing info', 'Please add a subject and message before submitting.');
      return;
    }

    Alert.alert('Submitted', 'Thanks — your feedback was sent.');
    setSubject('');
    setMessage('');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Customer feedback</Text>
        </View>
        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Subject</Text>

        <View style={styles.inputWrap}>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Type a subject"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            returnKeyType="next"
            onFocus={() => setSubjectOpen(false)}
          />
          <TouchableOpacity activeOpacity={0.85} style={styles.dropdownBtn} onPress={() => setSubjectOpen((v) => !v)}>
            <Ionicons name={subjectOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        {subjectOpen ? (
          <View style={styles.dropdownMenu}>
            {subjectSuggestions.map((s, i) => (
              <TouchableOpacity
                key={s}
                activeOpacity={0.85}
                onPress={() => {
                  setSubject(s);
                  setSubjectOpen(false);
                }}
                style={styles.dropdownRow}
              >
                <Text style={styles.dropdownText}>{s}</Text>
                {i !== subjectSuggestions.length - 1 ? <View pointerEvents="none" style={styles.dropdownDivider} /> : null}
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Message</Text>
        <View style={[styles.inputWrap, styles.textareaWrap]}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us what's going on…"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textarea]}
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.submitBtn} onPress={onPressSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerRow: {
    paddingHorizontal: 14,
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
  headerRightSpace: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
    marginBottom: 10,
  },
  inputWrap: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  dropdownBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    marginLeft: 10,
  },
  dropdownMenu: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  dropdownRow: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownDivider: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  textareaWrap: {
    height: 170,
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  textarea: {
    height: '100%',
  },
  submitBtn: {
    marginTop: 18,
    height: 54,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
});
