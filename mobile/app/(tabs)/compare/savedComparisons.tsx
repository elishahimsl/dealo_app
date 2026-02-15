import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Circle, Defs, G, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

const BRAND_GREEN = '#0E9F6E';

type SavedComparison = {
  id: string;
  title: string;
  group: 'recents' | 'later';
  scoreA: number;
  scoreB: number;
};

function FilterGlyph() {
  return (
    <View style={styles.filterGlyph}>
      <View style={[styles.filterLine, styles.filterLine1]} />
      <View style={[styles.filterLine, styles.filterLine2]} />
      <View style={[styles.filterLine, styles.filterLine3]} />
    </View>
  );
}

function ScoreBadge({ top, bottom }: { top: number; bottom: number }) {
  const percent = Math.max(0, Math.min(1, top / 100));
  const size = 36;
  const stroke = 3;
  const r = 14;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const dash = c * 0.72;
  const gap = c - dash;
  const dashOffset = dash - dash * percent;

  return (
    <View style={styles.scoreBadge}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.scoreSvg}>
        <G rotation={-110} originX={cx} originY={cy}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#D1FAE5"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
          />
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={BRAND_GREEN}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={dashOffset}
          />
        </G>
      </Svg>

      <View style={styles.scoreNumsCol}>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={styles.scoreMain}>
          {top}
        </Text>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={styles.scoreSecondary}>
          {bottom}
        </Text>
      </View>
    </View>
  );
}

function ComparisonTile({ item }: { item: SavedComparison }) {
  const best = Math.max(item.scoreA, item.scoreB);
  const worst = Math.min(item.scoreA, item.scoreB);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.tileWrap}>
      <View style={styles.tileCard}>
        <ScoreBadge top={best} bottom={worst} />

        <View style={styles.tileVisual}>
          <View pointerEvents="none" style={styles.productBackCard} />
          <View style={styles.productFrontCard}>
            <View style={styles.winnerRibbon}>
              <Text style={styles.winnerRibbonText}>Winner</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.tileHeart}>
          <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.tileTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

export default function SavedComparisonsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = (params.returnTo ?? '').toString().trim();
  const selfHref = returnTo
    ? (`/compare/savedComparisons?returnTo=${encodeURIComponent(returnTo)}` as const)
    : ('/compare/savedComparisons' as const);

  const data = useMemo<SavedComparison[]>(
    () => [
      { id: 'r1', title: 'iPhone 15 v. Z Flip', group: 'recents', scoreA: 90, scoreB: 82 },
      { id: 'r2', title: 'Beats v. Skullcandy', group: 'recents', scoreA: 88, scoreB: 84 },
      { id: 'r3', title: 'Samsonite v. Coach', group: 'recents', scoreA: 86, scoreB: 79 },
      { id: 'r4', title: 'Amazon Echo v. Google Home', group: 'recents', scoreA: 83, scoreB: 80 },
      { id: 'l1', title: 'Lenovo v. HP', group: 'later', scoreA: 84, scoreB: 77 },
      { id: 'l2', title: 'Adidas v. Nike', group: 'later', scoreA: 81, scoreB: 78 },
    ],
    []
  );

  const recents = data.filter((d) => d.group === 'recents');
  const later = data.filter((d) => d.group === 'later');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Svg pointerEvents="none" height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="sun" cx="-8%" cy="-12%" rx="95%" ry="95%" fx="-8%" fy="-12%">
            <Stop offset="0" stopColor="#B9F6D2" stopOpacity={0.9} />
            <Stop offset="0.22" stopColor="#34D399" stopOpacity={0.55} />
            <Stop offset="0.52" stopColor={BRAND_GREEN} stopOpacity={0.22} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>

          <LinearGradient id="sunRay" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#34D399" stopOpacity={0.14} />
            <Stop offset="0.35" stopColor="#34D399" stopOpacity={0.06} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#sun)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#sunRay)" />
      </Svg>

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (returnTo) router.replace(returnTo as Href);
            else if (router.canGoBack()) router.back();
            else router.replace('/compare' as Href);
          }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Comparisons</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recents</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.iconOnlyBtn}
            onPress={() => router.push(`/filter?returnTo=${encodeURIComponent(selfHref)}` as unknown as Href)}
          >
            <FilterGlyph />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tilesRowContent}>
          {recents.map((item) => (
            <ComparisonTile key={item.id} item={item} />
          ))}
        </ScrollView>

        <View style={[styles.sectionHeaderRow, styles.sectionHeaderRowLater]}>
          <Text style={styles.sectionTitle}>Saved for later</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.iconOnlyBtn}
            onPress={() => router.push(`/filter?returnTo=${encodeURIComponent(selfHref)}` as unknown as Href)}
          >
            <FilterGlyph />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tilesRowContent}>
          {later.map((item) => (
            <ComparisonTile key={item.id} item={item} />
          ))}
        </ScrollView>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 96,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderRowLater: {
    marginTop: 28,
  },
  iconOnlyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.2,
    marginBottom: 0,
    fontFamily: 'Manrope-Regular',
  },
  tilesRowContent: {
    paddingRight: 18,
    gap: 18,
  },
  tileWrap: {
    width: 238,
    marginBottom: 0,
  },
  tileCard: {
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    padding: 12,
    height: 140,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  scoreBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  scoreSvg: {
    position: 'absolute',
    top: 1,
    left: 1,
  },
  scoreNumsCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreMain: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 12,
    includeFontPadding: false,
    fontFamily: 'Manrope-Regular',
  },
  scoreSecondary: {
    marginTop: 1,
    fontSize: 8,
    fontWeight: '800',
    color: '#111827',
    opacity: 0.6,
    lineHeight: 8,
    includeFontPadding: false,
    fontFamily: 'Manrope-Regular',
  },
  tileHeart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(17,24,39,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  tileVisual: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  productBackCard: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.05)',
    left: 72,
    top: 20,
    opacity: 0.75,
    transform: [{ rotate: '0deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 2,
  },
  productFrontCard: {
    width: 108,
    height: 108,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    left: 0,
    top: 0,
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
    overflow: 'hidden',
  },
  winnerRibbon: {
    position: 'absolute',
    left: -24,
    top: 12,
    width: 92,
    height: 20,
    backgroundColor: BRAND_GREEN,
    borderRadius: 999,
    overflow: 'hidden',
    transform: [{ rotate: '-38deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerRibbonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    fontFamily: 'Manrope-Regular',
  },
  tileTitle: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  filterGlyph: {
    width: 18,
    height: 14,
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 2,
  },
  filterLine: {
    height: 2,
    borderRadius: 0,
    backgroundColor: '#111827',
    opacity: 0.75,
  },
  filterLine1: {
    width: 18,
  },
  filterLine2: {
    width: 13,
  },
  filterLine3: {
    width: 10,
  },
});
