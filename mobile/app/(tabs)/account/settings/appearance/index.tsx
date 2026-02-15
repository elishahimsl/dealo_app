
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';
import { setThemePreference, useThemePreference } from '@/hooks/use-color-scheme';

function ThemeTile({
  title,
  subtitle,
  icon,
  selected,
  onPress,
  fullWidth = false,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  fullWidth?: boolean;
}) {
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const iconDefault = useThemeColor({}, 'icon');
  const brandPrimary = useThemeColor({}, 'brandPrimary');
  const border = useThemeColor({}, 'border');
  const surface1 = useThemeColor({}, 'surface1');
  const surface2 = useThemeColor({}, 'surface2');

  const tileBorder = selected ? brandPrimary : border;
  const tileBg = selected ? surface2 : surface1;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.tile, fullWidth ? styles.tileFull : styles.tileHalf, { backgroundColor: tileBg, borderColor: tileBorder }]}
    >
      <View style={styles.tileTopRow}>
        <View style={[styles.iconWrap, { backgroundColor: selected ? brandPrimary : surface2 }]}>
          <Ionicons name={icon} size={18} color={selected ? '#0F1412' : iconDefault} />
        </View>
        <View style={styles.checkWrap}>
          <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={selected ? brandPrimary : iconDefault} />
        </View>
      </View>

      <Text style={[styles.tileTitle, { color: textPrimary }]}>{title}</Text>
      <Text style={[styles.tileSubtitle, { color: textSecondary }]}>{subtitle}</Text>

      <View style={styles.miniPreviewRow}>
        <View style={[styles.miniDot, { backgroundColor: brandPrimary }]} />
        <View style={[styles.miniBar, { backgroundColor: border }]} />
        <View style={[styles.miniBarShort, { backgroundColor: border }]} />
      </View>
    </TouchableOpacity>
  );
}

export default function Appearance() {
  const router = useRouter();
  const pref = useThemePreference();

  const bg = useThemeColor({}, 'bgPrimary');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const iconDefault = useThemeColor({}, 'icon');
  const surface1 = useThemeColor({}, 'surface1');
  const border = useThemeColor({}, 'border');
  const divider = useThemeColor({}, 'divider');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={iconDefault} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Appearance</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Theme</Text>

          <View style={styles.tilesGrid}>
            <ThemeTile
              title="Light"
              subtitle="Bright, clean"
              icon="sunny-outline"
              selected={pref === 'light'}
              onPress={() => setThemePreference('light')}
            />
            <ThemeTile
              title="Dark"
              subtitle="Low-glare"
              icon="moon-outline"
              selected={pref === 'dark'}
              onPress={() => setThemePreference('dark')}
            />
            <ThemeTile
              title="System"
              subtitle="Match device"
              icon="settings-outline"
              selected={pref === 'system'}
              onPress={() => setThemePreference('system')}
              fullWidth
            />
          </View>
        </View>

        <View style={[styles.previewCard, { backgroundColor: surface1, borderColor: border }]}>
          <View style={[styles.previewHeader, { borderBottomColor: divider }]}>
            <Text style={[styles.previewTitle, { color: textPrimary }]}>Preview</Text>
            <View style={[styles.previewPill, { backgroundColor: surface1, borderColor: border }]}>
              <Text style={[styles.previewPillText, { color: textSecondary }]}>
                {pref === 'system' ? 'System' : pref === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
          </View>

          <View style={styles.previewBody}>
            <Text style={[styles.previewBodyText, { color: textSecondary }]}>
              This is a quick sample of how text and surfaces look in your current theme.
            </Text>
            <View style={[styles.previewButton, { backgroundColor: iconDefault }]} />
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: surface1, borderColor: border }]}>
          <Ionicons name="information-circle-outline" size={18} color={iconDefault} />
          <Text style={[styles.infoText, { color: textSecondary }]}>
            Choose System to follow your device setting automatically.
          </Text>
        </View>
      </ScrollView>
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

  scrollContent: {
    paddingBottom: 28,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
    marginBottom: 10,
    fontFamily: 'Manrope-Regular',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  tile: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  tileHalf: {
    width: '48%',
    minHeight: 124,
  },
  tileFull: {
    width: '100%',
    minHeight: 110,
  },
  tileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkWrap: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
    fontFamily: 'Manrope-Regular',
  },
  tileSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'Manrope-Regular',
  },
  miniPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  miniBar: {
    height: 8,
    flex: 1,
    borderRadius: 6,
    opacity: 0.7,
  },
  miniBarShort: {
    height: 8,
    width: 42,
    borderRadius: 6,
    opacity: 0.7,
  },

  previewCard: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },
  previewPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewPillText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Manrope-Regular',
  },
  previewBody: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  previewBodyText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: 'Manrope-Regular',
  },
  previewButton: {
    height: 44,
    borderRadius: 12,
    opacity: 0.18,
  },

  infoBox: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    fontFamily: 'Manrope-Regular',
  },
});
