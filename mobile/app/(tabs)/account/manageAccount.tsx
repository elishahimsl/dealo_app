 
import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useAccountProfile } from '../_layout';

type FieldKey = 'name' | 'email' | 'phone' | 'bio';

type Profile = {
  name: string;
  email: string;
  phone: string;
  bio: string;
};

export default function ManageAccount() {
  const router = useRouter();
  const BRAND_GREEN = '#0E9F6E';

  const { profile: globalProfile, setProfile: setGlobalProfile } = useAccountProfile();

  const [profile, setProfile] = useState<Profile>(() => globalProfile);

  const [savedProfile, setSavedProfile] = useState<Profile>(() => globalProfile);

  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);

  const inputRefs = useRef<Record<FieldKey, TextInput | null>>({
    name: null,
    email: null,
    phone: null,
    bio: null,
  });

  const initial = useMemo(() => {
    const trimmed = profile.name.trim();
    if (!trimmed) return '';
    const first = trimmed.split(' ')[0]?.trim() ?? '';
    if (!first) return '';
    return first[0]?.toUpperCase() ?? '';
  }, [profile.name]);

  const isDirty = useMemo(() => {
    return (
      profile.name !== savedProfile.name ||
      profile.email !== savedProfile.email ||
      profile.phone !== savedProfile.phone ||
      profile.bio !== savedProfile.bio
    );
  }, [profile, savedProfile]);

  const updateField = (key: FieldKey, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const focusField = (key: FieldKey) => {
    setFocusedField(key);
    setTimeout(() => inputRefs.current[key]?.focus(), 50);
  };

  const blurAll = () => {
    (Object.keys(inputRefs.current) as FieldKey[]).forEach((k) => inputRefs.current[k]?.blur());
    setFocusedField(null);
    Keyboard.dismiss();
  };

  const saveChanges = () => {
    setGlobalProfile(profile);
    setSavedProfile(profile);
    blurAll();
    console.log('Saved profile:', profile);
  };

  const discardChanges = () => {
    setProfile(savedProfile);
    blurAll();
  };

  const renderFieldRow = (args: {
    keyName: FieldKey;
    label: string;
    value: string;
    placeholder: string;
    icon: keyof typeof Ionicons.glyphMap;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words';
    multiline?: boolean;
  }) => {
    const isFocused = focusedField === args.keyName;
    const isMultiline = !!args.multiline;

    return (
      <View>
        <TouchableOpacity
          style={[styles.row, isMultiline ? styles.rowMultiline : null]}
          activeOpacity={0.85}
          onPress={() => focusField(args.keyName)}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIcon, isMultiline ? styles.rowIconMultiline : null]}>
              <Ionicons name={args.icon} size={18} color="#111827" />
            </View>
            <View style={styles.rowTextBlock}>
              <Text style={styles.rowLabel}>{args.label}</Text>
              <TextInput
                ref={(r) => {
                  inputRefs.current[args.keyName] = r;
                }}
                value={args.value}
                onChangeText={(t) => updateField(args.keyName, t)}
                placeholder={args.placeholder}
                placeholderTextColor="#9CA3AF"
                style={[
                  styles.inlineInput,
                  args.multiline && styles.inlineInputMultiline,
                  isFocused && styles.inlineInputFocused,
                ]}
                keyboardType={args.keyboardType ?? 'default'}
                autoCapitalize={args.autoCapitalize ?? 'sentences'}
                multiline={args.multiline}
                textAlignVertical={args.multiline ? 'top' : 'center'}
                returnKeyType={args.multiline ? 'default' : 'done'}
                blurOnSubmit={!args.multiline}
                onSubmitEditing={() => {
                  if (!args.multiline) {
                    inputRefs.current[args.keyName]?.blur();
                  }
                }}
                onFocus={() => setFocusedField(args.keyName)}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => router.replace('/account' as Href)}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Info</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.topBlock}>
            <View style={[styles.avatar, { borderColor: `${BRAND_GREEN}22` }]}>
              {initial ? (
                <Text style={[styles.avatarText, { color: BRAND_GREEN }]}>{initial}</Text>
              ) : (
                <Ionicons name="person-outline" size={34} color="#111827" />
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.list}>
            {renderFieldRow({
              keyName: 'name',
              label: 'Name',
              value: profile.name,
              placeholder: 'Add your full name',
              icon: 'person-outline',
              autoCapitalize: 'words',
            })}
            <View style={styles.divider} />
            {renderFieldRow({
              keyName: 'bio',
              label: 'Bio',
              value: profile.bio,
              placeholder: 'Tell us about you',
              icon: 'chatbox-ellipses-outline',
              autoCapitalize: 'sentences',
              multiline: true,
            })}
          </View>

          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.list}>
            {renderFieldRow({
              keyName: 'email',
              label: 'Email',
              value: profile.email,
              placeholder: 'Add your email',
              icon: 'mail-outline',
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}
            <View style={styles.divider} />
            {renderFieldRow({
              keyName: 'phone',
              label: 'Phone number',
              value: profile.phone,
              placeholder: 'Add your phone number',
              icon: 'call-outline',
              keyboardType: 'phone-pad',
            })}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={saveChanges}
              disabled={!isDirty}
              style={[styles.saveButton, { backgroundColor: BRAND_GREEN }, !isDirty && styles.buttonDisabled]}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={discardChanges}
              disabled={!isDirty}
              style={[styles.discardButton, !isDirty && styles.buttonDisabled]}
            >
              <Text style={styles.discardButtonText}>Discard Changes</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 28 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topBlock: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 14,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  topSubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
    fontFamily: 'Manrope-Regular',
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEF2F7',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 14,
  },
  rowMultiline: {
    alignItems: 'flex-start',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowIconMultiline: {
    marginTop: 2,
  },
  rowTextBlock: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Manrope-Regular',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Manrope-Regular',
  },
  rowValuePlaceholder: {
    color: '#9CA3AF',
  },
  inlineInput: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Manrope-Regular',
  },
  inlineInputMultiline: {
    minHeight: 64,
    paddingTop: 4,
  },
  inlineInputFocused: {
    color: '#111827',
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
  discardButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  discardButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

