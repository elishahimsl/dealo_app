import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { fetchTrendingProducts, fetchProductsByCategory, DiscoveryProduct } from '../../../lib/services/discovery-service';

const { width } = Dimensions.get('window');

const tools = [
  {
    id: 'priceDrop',
    label: 'Price Drop',
    icon: 'flash-outline' as const,
    iconColor: '#0E9F6E',
    bgColor: '#E5E7EB',
  },
  {
    id: 'dealoAi',
    label: 'DeaLo AI',
    icon: 'sparkles-outline' as const,
    iconColor: '#0E9F6E',
    bgColor: '#E5E7EB',
  },
  {
    id: 'dealscanner',
    label: 'DealScanner',
    icon: 'scan-outline' as const,
    iconColor: '#0E9F6E',
    bgColor: '#E5E7EB',
  },
];

const mens = [
  {
    id: 'm1',
    brand: 'Nike',
    product: 'Everyday Hoodie',
    category: 'Mens',
    image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm2',
    brand: 'Adidas',
    product: 'Running Sneakers',
    category: 'Mens',
    image: 'https://images.unsplash.com/photo-1542291026-f7367b8c5c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm3',
    brand: 'Casio',
    product: 'Classic Watch',
    category: 'Mens',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  },
];

const womens = [
  {
    id: 'w1',
    brand: 'Coach',
    product: 'Everyday Tote',
    category: 'Womens',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'w2',
    brand: 'Uniqlo',
    product: 'Cozy Sweater',
    category: 'Womens',
    image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'w3',
    brand: 'Chanel',
    product: 'Signature Perfume',
    category: 'Womens',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
  },
];

const fashion = [
  {
    id: 'f1',
    brand: 'Zara',
    product: 'Street Style',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'f2',
    brand: 'Levi\'s',
    product: 'Denim Jacket',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'f3',
    brand: 'H&M',
    product: 'Fresh Drops',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80',
  },
];

const interestTiles = [
  {
    id: 'men',
    label: 'Men',
    subheader: 'Essentials',
    icon: 'man-outline' as const,
  },
  {
    id: 'women',
    label: 'Women',
    subheader: 'Trending',
    icon: 'woman-outline' as const,
  },
  {
    id: 'fashion',
    label: 'Fashion',
    subheader: 'New drops',
    icon: 'shirt-outline' as const,
  },
  {
    id: 'tech',
    label: 'Tech',
    subheader: 'Smart picks',
    icon: 'laptop-outline' as const,
  },
  {
    id: 'health',
    label: 'Health',
    subheader: 'Wellness',
    icon: 'fitness-outline' as const,
  },
  {
    id: 'sports',
    label: 'Sports',
    subheader: 'Gear',
    icon: 'football-outline' as const,
  },
  {
    id: 'home',
    label: 'Home',
    subheader: 'Decor',
    icon: 'home-outline' as const,
  },
  {
    id: 'gifts',
    label: 'Gifts',
    subheader: 'Top picks',
    icon: 'gift-outline' as const,
  },
];

const trending = [
  {
    id: 't1',
    brand: 'Apple',
    product: 'Smart Fitness Watch',
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 't2',
    brand: 'Sony',
    product: 'Noise-Cancelling Earbuds',
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 't3',
    brand: 'Dyson',
    product: 'Wireless Vacuum',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1581578029523-3f5b3c52db64?auto=format&fit=crop&w=1200&q=80',
  },
];

const logos = [
  { id: 'amazon', domain: 'amazon.com', label: 'Amazon' },
  { id: 'target', domain: 'target.com', label: 'Target' },
  { id: 'apple', domain: 'apple.com', label: 'Apple' },
  { id: 'nike', domain: 'nike.com', label: 'Nike' },
  { id: 'bestbuy', domain: 'bestbuy.com', label: 'Best Buy' },
  { id: 'walmart', domain: 'walmart.com', label: 'Walmart' },
  { id: 'costco', domain: 'costco.com', label: 'Costco' },
  { id: 'ebay', domain: 'ebay.com', label: 'eBay' },
  { id: 'sephora', domain: 'sephora.com', label: 'Sephora' },
  { id: 'zara', domain: 'zara.com', label: 'Zara' },
  { id: 'homedepot', domain: 'homedepot.com', label: 'Home Depot' },
  { id: 'macys', domain: 'macys.com', label: 'Macy\'s' },
  { id: 'gap', domain: 'gap.com', label: 'GAP' },
  { id: 'lowes', domain: 'lowes.com', label: 'Lowe\'s' },
  { id: 'kohls', domain: 'kohls.com', label: 'Kohl\'s' },
  { id: 'etsy', domain: 'etsy.com', label: 'Etsy' },
  { id: 'sonos', domain: 'sonos.com', label: 'Sonos' },
  { id: 'lululemon', domain: 'lululemon.com', label: 'Lululemon' },
];

const logosPerPage = 6;
const totalPages = Math.ceil(logos.length / logosPerPage);

type MockProduct = { id: string; brand: string; product: string; category: string; image: string };

function toMockProduct(dp: DiscoveryProduct, fallbackCategory: string): MockProduct {
  return { id: dp.id, brand: dp.store, product: dp.name, category: dp.category || fallbackCategory, image: dp.image };
}

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logoPage, setLogoPage] = useState(0);
  const router = useRouter();

  // Real data state with mock fallbacks
  const [realTrending, setRealTrending] = useState<MockProduct[]>([]);
  const [realMens, setRealMens] = useState<MockProduct[]>([]);
  const [realWomens, setRealWomens] = useState<MockProduct[]>([]);
  const [realFashion, setRealFashion] = useState<MockProduct[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [t, m, w, f] = await Promise.all([
          fetchTrendingProducts(6),
          fetchProductsByCategory('Mens', 6),
          fetchProductsByCategory('Womens', 6),
          fetchProductsByCategory('Fashion', 6),
        ]);
        if (!active) return;
        if (t.length > 0) setRealTrending(t.map((p) => toMockProduct(p, 'Trending')));
        if (m.length > 0) setRealMens(m.map((p) => toMockProduct(p, 'Mens')));
        if (w.length > 0) setRealWomens(w.map((p) => toMockProduct(p, 'Womens')));
        if (f.length > 0) setRealFashion(f.map((p) => toMockProduct(p, 'Fashion')));
      })();
      return () => { active = false; };
    }, [])
  );

  // Use real data when available, fall back to mocks
  const trendingData = realTrending.length > 0 ? realTrending : trending;
  const mensData = realMens.length > 0 ? realMens : mens;
  const womensData = realWomens.length > 0 ? realWomens : womens;
  const fashionData = realFashion.length > 0 ? realFashion : fashion;

  const truncate = (text: string, maxLen: number) => {
    const t = text.trim();
    if (t.length <= maxLen) return t;
    return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
  };

  const logoPages = useMemo(() => {
    const pages: (typeof logos)[] = [];
    for (let i = 0; i < logos.length; i += logosPerPage) {
      pages.push(logos.slice(i, i + logosPerPage));
    }
    return pages;
  }, []);

  const onPressTool = (id: string) => {
    if (id === 'priceDrop') {
      router.push('/discover/tools/priceDrop' as Href);
      return;
    }

    if (id === 'dealscanner') {
      router.push('/discover/tools/dealScanner' as Href);
      return;
    }
  };

  const onPressInterest = (id: string) => {
    if (id === 'men') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Mens', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'women') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Womens', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'fashion') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Fashion', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'tech') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Tech', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'health') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Health', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'sports') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Sports', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'home') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Home', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }
    if (id === 'gifts') {
      router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Gifts', returnTo: '/(tabs)/discover' } } as unknown as Href);
      return;
    }

    router.push({ pathname: '/compare/discoverProducts', params: { returnTo: '/(tabs)/discover' } } as unknown as Href);
  };

  const half = useMemo(() => (width - 20 * 2 - 10) / 2, []);
  const full = useMemo(() => width - 20 * 2, []);

  const logoGap = 12;
  const logoTileW = useMemo(() => (width - 20 * 2 - logoGap * 2) / 3, []);

  const renderTrending = ({ item }: { item: { id: string; brand: string; product: string; category: string; image: string } }) => (
    <View style={styles.trendingWrapper}>
      <TouchableOpacity style={styles.trendingCard} activeOpacity={0.9}>
        <Image source={{ uri: item.image }} style={styles.trendingImage} />
      </TouchableOpacity>

      <View style={styles.tileMetaRow}>
        <View style={styles.tileBrandCircle}>
          <Text style={styles.tileBrandCircleText}>{item.brand.slice(0, 1).toUpperCase()}</Text>
        </View>

        <View style={styles.tileMetaTextWrap}>
          <Text style={styles.tileBrand} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.tileProduct} numberOfLines={1}>
            {truncate(item.product, 26)}
          </Text>
          <Text style={styles.tileCategory} numberOfLines={1}>
            {item.category}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <Text style={styles.discoverTitle}>Discover</Text>
        </View>

        <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => router.push('/search' as Href)}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <Text style={styles.searchInput}>Search</Text>
          <TouchableOpacity style={styles.searchCameraButton} onPress={() => router.push('/(tabs)/camera' as Href)}>
            <Ionicons name="camera-outline" size={18} color="#0E9F6E" />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.sectionPad}>
          <Text style={styles.sectionHeaderTitle}>Explore by interest</Text>
          <View style={styles.interestGrid}>
            {interestTiles.map((t) => (
              <TouchableOpacity key={t.id} style={[styles.interestTile, { width: half }]} activeOpacity={0.9} onPress={() => onPressInterest(t.id)}>
                <View style={styles.interestTileInner}>
                  <View style={styles.interestTileTopRow}>
                    <Text style={styles.interestCornerLabel}>{t.label}</Text>
                    <View style={styles.interestIconBadge}>
                      <Ionicons name={t.icon} size={18} color="#0E9F6E" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionPad}>
          <Text style={styles.sectionHeaderTitle}>Explore Stores & Brands</Text>
          <FlatList
            data={logoPages}
            keyExtractor={(_item, idx) => `logos-page-${idx}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={full}
            snapToAlignment="start"
            disableIntervalMomentum
            bounces={false}
            onMomentumScrollEnd={(e) => {
              const next = Math.round(e.nativeEvent.contentOffset.x / full);
              setLogoPage(Math.max(0, Math.min(totalPages - 1, next)));
            }}
            renderItem={({ item }) => (
              <View style={[styles.logoPage, { width: full }]}>
                <View style={[styles.logoGrid, { columnGap: logoGap }]}>
                  {item.map((l) => (
                    <View key={l.id} style={[styles.logoTile, { width: logoTileW }]}>
                      <Image source={{ uri: `https://logo.clearbit.com/${l.domain}` }} style={styles.logoImage} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          />

          <View style={styles.dotsContainer}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <View key={`dot-${idx}`} style={[styles.dot, idx === logoPage && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.sectionPad}>
          <Text style={styles.sectionHeaderTitle}>Tools</Text>
          <View style={styles.toolsRow}>
            {tools.map((tool) => (
              <View key={tool.id} style={styles.toolCard}>
                <View style={styles.toolDarkLayer} />
                <TouchableOpacity activeOpacity={0.9} onPress={() => onPressTool(tool.id)}>
                  <View style={[styles.toolTopRow, { backgroundColor: tool.bgColor }]}>
                    <View style={[styles.toolIconBadge, { backgroundColor: 'white' }]}>
                      <Ionicons name={tool.icon} size={20} color={tool.iconColor} />
                    </View>
                    <Text style={styles.toolLabel} numberOfLines={1}>
                      {tool.label}
                    </Text>
                  </View>
                  <View style={[styles.toolBar, { backgroundColor: '#E5E7EB' }]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionPad}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Trending Right Now</Text>
          </View>
          <FlatList
            data={trendingData}
            renderItem={renderTrending}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>

        <View style={styles.sectionPad}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Mens</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Mens', returnTo: '/(tabs)/discover' } } as unknown as Href)}
            >
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={mensData}
            renderItem={renderTrending}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>

        <View style={styles.sectionPad}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Womens</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Womens', returnTo: '/(tabs)/discover' } } as unknown as Href)}
            >
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={womensData}
            renderItem={renderTrending}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>

        <View style={styles.sectionPad}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Fashion</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/compare/discoverProducts', params: { pill: 'Fashion', returnTo: '/(tabs)/discover' } } as unknown as Href)}
            >
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={fashionData}
            renderItem={renderTrending}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 2,
  },
  discoverTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 48,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    fontFamily: 'Manrope-Regular',
  },
  searchCameraButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionPad: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  toolsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  toolCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toolDarkLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17,24,39,0.03)',
    borderRadius: 12,
  },
  toolTopRow: {
    padding: 12,
    alignItems: 'center',
  },
  toolIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolImageIcon: {
    width: 24,
    height: 24,
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },
  toolSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  toolBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  toolsGrid: {
    marginTop: 8,
  },
  toolsScroll: {
    paddingBottom: 20,
  },
  logoPage: {
    paddingTop: 10,
    paddingHorizontal: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    fontFamily: 'Manrope-Regular',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seeAllText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  interestTile: {
    height: 80,
    marginBottom: 0,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  interestTileInner: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  interestTileTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  interestSubheader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    paddingRight: 10,
  },
  interestCorner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  interestCornerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  interestIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 6,
  },
  dot: {
    width: 8,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#0E9F6E',
  },
  trendingList: {
    paddingRight: 14,
    paddingBottom: 10,
  },
  trendingWrapper: {
    marginRight: 14,
  },
  trendingCard: {
    width: 150,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  trendingImage: {
    width: '100%',
    height: 130,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Manrope-Regular',
  },
  trendingCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
  },
  tileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  tileBrandCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileBrandCircleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  tileMetaTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  tileBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.15,
    fontFamily: 'Manrope-Regular',
  },
  tileProduct: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.15,
    fontFamily: 'Manrope-Regular',
  },
  tileCategory: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: -0.15,
    fontFamily: 'Manrope-Regular',
  },
  logoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 10,
  },
  logoTile: {
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  logoImage: {
    width: 100,
    height: 28,
    maxWidth: '80%',
    maxHeight: '60%',
    resizeMode: 'contain',
  },
  logoScroll: {
    paddingBottom: 20,
  },
  logoCard: {
    width: 190,
    height: 110,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  logoIcon: {
    marginBottom: 8,
    opacity: 0.9,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  dealsBanner: {
    marginTop: 18,
    marginHorizontal: 18,
    height: 170,
    borderRadius: 26,
    backgroundColor: '#0AA56A',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  dealsTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dealsIcon: {
    position: 'absolute',
    right: 14,
    top: 44,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 8,
  },
  topicTile: {
    width: (width - 18 * 2 - 14) / 2,
    height: 120,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    padding: 18,
    justifyContent: 'flex-end',
  },
  topicIcon: {
    position: 'absolute',
    top: 18,
    right: 18,
  },
  topicLabel: {
    fontSize: 26,
    fontWeight: '600',
    color: '#111827',
  },
  moreTopicsButton: {
    height: 56,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#0E9F6E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 38,
    backgroundColor: '#FFFFFF',
  },
  moreTopicsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0E9F6E',
  },
  footerBrand: {
    textAlign: 'center',
    marginTop: 36,
    fontSize: 34,
    fontWeight: '600',
    color: '#9CA3AF',
    opacity: 0.55,
  },
});
