import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function Privacy() {
  const router = useRouter();

  const bg = useThemeColor({}, 'bgPrimary');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const iconDefault = useThemeColor({}, 'icon');
  const surface1 = useThemeColor({}, 'surface1');
  const border = useThemeColor({}, 'border');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={iconDefault} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Privacy</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <View style={[styles.card, { backgroundColor: surface1, borderColor: border }]}>
        <Text style={[styles.title, { color: textPrimary }]}>Coming soon</Text>
        <Text style={[styles.body, { color: textSecondary }]}>This section will include privacy controls, permissions, and data settings.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },
  headerRightSpacer: {
    width: 44,
  },
  card: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
    fontFamily: 'Manrope-Regular',
  },
  body: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    fontFamily: 'Manrope-Regular',
  },
});
