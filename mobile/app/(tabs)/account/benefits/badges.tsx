import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_COLS = 3;
const GRID_GAP = 14;
const SIDE_PAD = 18;
const BADGE_SIZE = (SCREEN_W - SIDE_PAD * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

type Badge = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  howToEarn: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  progressMax?: number;
  isNextUp?: boolean;
};

const BADGES: Badge[] = [
  {
    id: 'first-scan',
    name: 'First Scan',
    icon: 'scan-outline',
    description: 'You scanned your first product!',
    howToEarn: 'Scan your first product',
    earned: true,
    earnedDate: 'Jan 15, 2026',
  },
  {
    id: 'deal-finder',
    name: 'Deal Finder',
    icon: 'search-outline',
    description: 'Completed your first comparison.',
    howToEarn: 'Complete your first comparison',
    earned: true,
    earnedDate: 'Jan 18, 2026',
  },
  {
    id: 'saver',
    name: 'Saver',
    icon: 'bookmark-outline',
    description: 'Saved 5 comparisons to revisit later.',
    howToEarn: 'Save 5 comparisons',
    earned: true,
    earnedDate: 'Feb 2, 2026',
  },
  {
    id: 'super-saver',
    name: 'Super Saver',
    icon: 'bookmarks-outline',
    description: 'A true deal collector — 25 saves!',
    howToEarn: 'Save 25 comparisons',
    earned: false,
    progress: 12,
    progressMax: 25,
    isNextUp: true,
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    icon: 'people-outline',
    description: 'Invited your first friend to DeaLo.',
    howToEarn: 'Invite your first friend',
    earned: false,
    progress: 0,
    progressMax: 1,
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    icon: 'flame-outline',
    description: 'Used DeaLo 3 days in a row!',
    howToEarn: 'Use the app 3 days in a row',
    earned: false,
    progress: 1,
    progressMax: 3,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    icon: 'trophy-outline',
    description: 'A full week of deal hunting.',
    howToEarn: 'Use the app 7 days in a row',
    earned: false,
    progress: 1,
    progressMax: 7,
  },
  {
    id: 'bargain-hunter',
    name: 'Bargain Hunter',
    icon: 'pricetag-outline',
    description: 'Found a deal more than 30% off!',
    howToEarn: 'Find a deal >30% off',
    earned: false,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    icon: 'compass-outline',
    description: 'Tried the Discover Products feature.',
    howToEarn: 'Try Discover Products',
    earned: false,
  },
  {
    id: 'feedback-hero',
    name: 'Feedback Hero',
    icon: 'chatbubble-outline',
    description: 'Helped us improve with your feedback.',
    howToEarn: 'Submit customer feedback',
    earned: false,
  },
  {
    id: 'premium-pioneer',
    name: 'Premium Pioneer',
    icon: 'rocket-outline',
    description: 'Explored the Premium experience.',
    howToEarn: 'Try Premium',
    earned: false,
  },
  {
    id: 'dealo-og',
    name: 'DeaLo OG',
    icon: 'star-outline',
    description: 'An original early adopter!',
    howToEarn: 'Be an early adopter',
    earned: true,
    earnedDate: 'Jan 10, 2026',
  },
];

function PulsingBorder({ children }: { children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View style={[styles.pulsingRing, { opacity: anim }]}>
      {children}
    </Animated.View>
  );
}

function BadgeCell({ badge, onPress }: { badge: Badge; onPress: () => void }) {
  const inner = (
    <TouchableOpacity activeOpacity={0.85} style={styles.badgeTouch} onPress={onPress}>
      <View
        style={[
          styles.badgeCircle,
          badge.earned ? styles.badgeCircleEarned : styles.badgeCircleLocked,
          badge.isNextUp && !badge.earned ? styles.badgeCircleNextUp : null,
        ]}
      >
        <Ionicons
          name={badge.icon}
          size={28}
          color={badge.earned ? BRAND_GREEN : '#B0B8B4'}
        />
        {!badge.earned && !badge.isNextUp && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={9} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text
        style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}
        numberOfLines={1}
      >
        {badge.name}
      </Text>
    </TouchableOpacity>
  );

  if (badge.isNextUp && !badge.earned) {
    return (
      <View style={styles.badgeCellWrap}>
        <PulsingBorder>{inner}</PulsingBorder>
      </View>
    );
  }

  return <View style={styles.badgeCellWrap}>{inner}</View>;
}

export default function BadgesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Badge | null>(null);

  const earnedCount = BADGES.filter((b) => b.earned).length;
  const totalCount = BADGES.length;
  const levelProgress = earnedCount / totalCount;
  const level = earnedCount <= 3 ? 1 : earnedCount <= 7 ? 2 : 3;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Badges</Text>
        </View>
        <View style={styles.counterPill}>
          <Text style={styles.counterText}>
            {earnedCount}/{totalCount}
          </Text>
        </View>
      </View>

      {/* Level Bar */}
      <View style={styles.levelCard}>
        <View style={styles.levelTop}>
          <View style={styles.levelLabelRow}>
            <Ionicons name="shield-checkmark" size={16} color={BRAND_GREEN} />
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
          <Text style={styles.levelSub}>
            {earnedCount} of {totalCount} badges
          </Text>
        </View>
        <View style={styles.levelBarBg}>
          <View style={[styles.levelBarFill, { width: `${Math.round(levelProgress * 100)}%` }]} />
        </View>
      </View>

      {/* Badge Grid */}
      <FlatList
        data={BADGES}
        numColumns={GRID_COLS}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BadgeCell badge={item} onPress={() => setSelected(item)} />}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />

      {/* Detail Modal */}
      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selected && (
              <>
                <View
                  style={[
                    styles.modalBadgeCircle,
                    selected.earned ? styles.modalBadgeEarned : styles.modalBadgeLocked,
                  ]}
                >
                  <Ionicons
                    name={selected.icon}
                    size={36}
                    color={selected.earned ? BRAND_GREEN : '#B0B8B4'}
                  />
                </View>

                <Text style={styles.modalName}>{selected.name}</Text>
                <Text style={styles.modalDesc}>{selected.description}</Text>

                {!selected.earned && (
                  <View style={styles.modalHowBlock}>
                    <Text style={styles.modalHowLabel}>How to earn</Text>
                    <Text style={styles.modalHowText}>{selected.howToEarn}</Text>
                  </View>
                )}

                {!selected.earned && selected.progress !== undefined && selected.progressMax !== undefined && (
                  <View style={styles.modalProgressWrap}>
                    <View style={styles.modalProgressBg}>
                      <View
                        style={[
                          styles.modalProgressFill,
                          { width: `${Math.round((selected.progress / selected.progressMax) * 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.modalProgressText}>
                      {selected.progress} / {selected.progressMax}
                    </Text>
                  </View>
                )}

                {selected.earned && selected.earnedDate && (
                  <View style={styles.modalEarnedRow}>
                    <Ionicons name="checkmark-circle" size={16} color={BRAND_GREEN} />
                    <Text style={styles.modalEarnedText}>Earned {selected.earnedDate}</Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.modalCloseBtn}
                  onPress={() => setSelected(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  /* Header */
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
  counterPill: {
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },

  /* Level */
  levelCard: {
    marginHorizontal: SIDE_PAD,
    marginTop: 16,
    marginBottom: 20,
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
  },
  levelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  levelSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  levelBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
  },

  /* Grid */
  grid: {
    paddingHorizontal: SIDE_PAD,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP + 4,
  },

  /* Badge Cell */
  badgeCellWrap: {
    width: BADGE_SIZE,
    alignItems: 'center',
  },
  badgeTouch: {
    alignItems: 'center',
  },
  badgeCircle: {
    width: BADGE_SIZE - 16,
    height: BADGE_SIZE - 16,
    borderRadius: (BADGE_SIZE - 16) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  badgeCircleEarned: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2.5,
    borderColor: BRAND_GREEN,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeCircleLocked: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  badgeCircleNextUp: {
    borderColor: BRAND_GREEN,
    borderWidth: 2.5,
    backgroundColor: '#F0FDF9',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  badgeNameLocked: {
    color: '#9CA3AF',
  },

  /* Pulsing Ring */
  pulsingRing: {
    borderRadius: 999,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 14,
  },
  modalBadgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalBadgeEarned: {
    backgroundColor: '#ECFDF5',
    borderWidth: 3,
    borderColor: BRAND_GREEN,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  modalBadgeLocked: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  modalName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  modalDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  modalHowBlock: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    padding: 14,
    marginBottom: 14,
  },
  modalHowLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  modalHowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  modalProgressWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  modalProgressBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
  },
  modalProgressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  modalEarnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  modalEarnedText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_GREEN,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  modalCloseBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
});