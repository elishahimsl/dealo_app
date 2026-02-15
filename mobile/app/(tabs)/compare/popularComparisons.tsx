import React, { useMemo, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';

type PopularComparison = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  group: 'now' | 'today' | 'often';
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

function MiniStack({ showRibbon }: { showRibbon?: boolean }) {
  const frontSize = showRibbon ? 120 : 108;
  const backSize = showRibbon ? 112 : 104;
  const backX = showRibbon ? 78 : 72;
  const frontY = 0;
  const backY = showRibbon ? 24 : 20;
  const stackW = backX + backSize;
  const stackH = Math.max(backY + backSize, frontY + frontSize);

  return (
    <View style={[styles.miniStackWrap, { width: stackW, height: stackH }]}>
      <View
        pointerEvents="none"
        style={[styles.miniBackCard, { width: backSize, height: backSize, left: backX, top: backY }]}
      />
      <View style={[styles.miniFront, { width: frontSize, height: frontSize, left: 0, top: frontY }]}>
        {showRibbon ? (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>Trending</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function GridTile({ item }: { item: PopularComparison }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.gridTileWrap}>
      <View style={styles.gridTileCard}>
        <MiniStack />
        <TouchableOpacity activeOpacity={0.85} style={styles.gridTileHeart}>
          <Ionicons name="heart-outline" size={16} color="#111827" />
        </TouchableOpacity>
      </View>

      <Text style={styles.gridTileTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

export default function PopularComparisonsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const [trendingIndex, setTrendingIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const trendingCardWidth = width - 18 * 2;

  const returnTo = (params.returnTo ?? '').toString().trim();
  const selfHref = returnTo
    ? (`/compare/popularComparisons?returnTo=${encodeURIComponent(returnTo)}` as const)
    : ('/compare/popularComparisons' as const);

  const items = useMemo<PopularComparison[]>(
    () => [
      {
        id: 'n1',
        title: 'Samsung v. iPhone',
        meta: '500+ comparisons',
        group: 'now',
      },
      { id: 'n2', title: 'AirPods v. Beats', meta: '430+ comparisons', group: 'now' },
      { id: 'n3', title: 'Adidas v. Nike', meta: '390+ comparisons', group: 'now' },
      { id: 't1', title: 'Lenovo v. HP', group: 'today' },
      { id: 't2', title: 'Adidas v. Nike', group: 'today' },
      { id: 'o1', title: 'AirPods v. Beats', group: 'often' },
      { id: 'o2', title: 'PlayStation v. Xbox', group: 'often' },
    ],
    []
  );

  const trending = items.filter((x) => x.group === 'now');
  const today = items.filter((x) => x.group === 'today');
  const often = items.filter((x) => x.group === 'often');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (returnTo) router.replace(returnTo as Href);
            else if (router.canGoBack()) router.back();
            else router.replace('/compare' as Href);
          }}
          style={styles.headerBackBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Popular Comparisons</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
        <TextInput placeholder="Search" placeholderTextColor="#6B7280" style={styles.searchInput} editable={false} pointerEvents="none" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <View style={{ width: 18 }} />
        </View>

        <View style={styles.trendingCard}>
          <TouchableOpacity activeOpacity={0.85} style={styles.trendingSave}>
            <Ionicons name="bookmark-outline" size={18} color="#111827" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={trendingCardWidth}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / trendingCardWidth);
              setTrendingIndex(Math.max(0, Math.min(trending.length - 1, idx)));
            }}
          >
            {trending.map((item) => (
              <View key={item.id} style={[styles.trendingPage, { width: trendingCardWidth }]}>
                <View style={styles.featureLeft}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  {item.meta ? <Text style={styles.featureMeta}>{item.meta}</Text> : null}
                </View>
                <View style={styles.featureRight}>
                  <MiniStack showRibbon />
                </View>
              </View>
            ))}
          </ScrollView>

          <View pointerEvents="none" style={styles.dotsWrap}>
            <View style={styles.dotsRow}>
              {trending.map((t, i) => (
                <View key={t.id} style={i === trendingIndex ? styles.dotActive : styles.dot} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Compared Today</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.iconOnlyBtn}
            onPress={() => router.push(`/filter?returnTo=${encodeURIComponent(selfHref)}` as unknown as Href)}
          >
            <FilterGlyph />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wideRowContent}>
            {today.map((item) => (
              <GridTile key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Often Compared</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.iconOnlyBtn}
            onPress={() => router.push(`/filter?returnTo=${encodeURIComponent(selfHref)}` as unknown as Href)}
          >
            <FilterGlyph />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wideRowContent}>
            {often.map((item) => (
              <GridTile key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

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
  headerRow: {
    height: 52,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackBtn: {
    width: 34,
    height: 34,
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
  headerRightSpacer: {
    width: 34,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    fontFamily: 'Manrope-Regular',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 96,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
    fontFamily: 'Manrope-Regular',
  },
  iconOnlyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  trendingCard: {
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    overflow: 'hidden',
    height: 210,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  trendingPage: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingSave: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
  },
  dotsWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 18,
    height: 5,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
  },
  featureLeft: {
    flex: 1,
    paddingRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    fontFamily: 'Manrope-Regular',
  },
  featureMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
  },
  featureRight: {
    width: 190,
    alignItems: 'flex-start',
  },
  grid: {
    marginBottom: 6,
  },
  wideRowContent: {
    paddingRight: 18,
    gap: 16,
  },
  gridTileWrap: {
    width: 238,
    marginBottom: 0,
  },
  gridTileCard: {
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
  gridTileHeart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  gridTileTitle: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  miniStackWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  miniBackCard: {
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.05)',
    opacity: 0.75,
    transform: [{ rotate: '0deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 2,
  },
  miniFront: {
    position: 'absolute',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
    overflow: 'hidden',
  },
  ribbon: {
    position: 'absolute',
    left: -20,
    top: 10,
    width: 78,
    height: 18,
    backgroundColor: BRAND_GREEN,
    borderRadius: 999,
    overflow: 'hidden',
    transform: [{ rotate: '-38deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
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
