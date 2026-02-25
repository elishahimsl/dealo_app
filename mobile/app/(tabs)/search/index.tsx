import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

const BRAND_GREEN = '#0E9F6E';
const { width } = Dimensions.get('window');

const categoryPills = ['Electronics', 'Groceries', 'Home', 'Beauty', 'Clothing'];

const popularStores = [
  { id: 'amazon', domain: 'amazon.com' },
  { id: 'target', domain: 'target.com' },
  { id: 'bestbuy', domain: 'bestbuy.com' },
  { id: 'walmart', domain: 'walmart.com' },
  { id: 'costco', domain: 'costco.com' },
];

const topBrands = [
  { id: 'apple', domain: 'apple.com' },
  { id: 'sony', domain: 'sony.com' },
  { id: 'nike', domain: 'nike.com' },
  { id: 'adidas', domain: 'adidas.com' },
  { id: 'samsung', domain: 'samsung.com' },
];

const recentSearchesSeed = [
  {
    id: 'r1',
    title: 'Sony WH-1000XM5',
    subtitle: 'Sony',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r2',
    title: 'Stanley Quencher',
    subtitle: 'Stanley',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r3',
    title: 'Apple AirPods Pro',
    subtitle: 'Apple',
    image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=200&q=80',
  },
];

const trendingSeed = [
  {
    id: 't1',
    title: 'Best Noise-Cancelling Headphones',
    subtitle: 'Most searched today',
    image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't2',
    title: 'Trending Running Shoes',
    subtitle: 'Price recently dropped',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't3',
    title: 'Top Protein Powders',
    subtitle: 'High demand this week',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't4',
    title: 'Most-Wanted Kitchen Gadgets',
    subtitle: 'Top searched appliances',
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=200&q=80',
  },
];

export default function Search() {
  const inputRef = useRef<TextInput>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const [query, setQuery] = useState('');
  const [activePill, setActivePill] = useState('Electronics');
  const [isFocused, setIsFocused] = useState(true);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const [recentSearches, setRecentSearches] = useState(recentSearchesSeed);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 380, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [blinkAnim]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}> 
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="sun" cx="-8%" cy="-12%" rx="95%" ry="95%" fx="-8%" fy="-12%">
              <Stop offset="0" stopColor="#B9F6D2" stopOpacity={0.9} />
              <Stop offset="0.22" stopColor="#34D399" stopOpacity={0.55} />
              <Stop offset="0.52" stopColor={BRAND_GREEN} stopOpacity={0.18} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="sunRay" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#34D399" stopOpacity={0.12} />
              <Stop offset="0.35" stopColor="#34D399" stopOpacity={0.05} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#sun)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#sunRay)" />
        </Svg>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchLeadingIcon} />
            <View style={styles.searchInputInner}>
              {isFocused && query.length === 0 ? (
                <Animated.View style={[styles.blinkCursor, { opacity: blinkAnim }]} />
              ) : null}
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search"
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
              />
            </View>
            <View style={styles.searchCameraButton}>
              <Ionicons name="camera-outline" size={18} color={BRAND_GREEN} />
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {categoryPills.map((pill) => {
            const active = pill === activePill;
            return (
              <TouchableOpacity
                key={pill}
                activeOpacity={0.88}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => {
                  setActivePill(pill);
                  inputRef.current?.focus();
                }}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{pill}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.sectionTitle}>Popular Stores</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.sectionAction}>Clear ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logoRow}>
            {popularStores.map((store) => (
              <View key={store.id} style={styles.logoTile}>
                {!logoErrors[store.id] ? (
                  <Image
                    source={{ uri: `https://logo.clearbit.com/${store.domain}` }}
                    style={styles.logoImage}
                    onError={() => setLogoErrors((prev) => ({ ...prev, [store.id]: true }))}
                  />
                ) : (
                  <View style={styles.logoBlank} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="logo-apple" size={16} color="#6B7280" />
              <Text style={styles.sectionTitle}>Top Brands</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logoRow}>
            {topBrands.map((brand) => (
              <View key={brand.id} style={styles.logoTile}>
                {!logoErrors[brand.id] ? (
                  <Image
                    source={{ uri: `https://logo.clearbit.com/${brand.domain}` }}
                    style={styles.logoImage}
                    onError={() => setLogoErrors((prev) => ({ ...prev, [brand.id]: true }))}
                  />
                ) : (
                  <View style={styles.logoBlank} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.sectionTitle}>Recent Searches</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setRecentSearches([])}>
              <Text style={styles.sectionAction}>Clear ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {recentSearches.map((item, idx) => (
              <TouchableOpacity key={item.id} style={[styles.listRow, idx !== recentSearches.length - 1 && styles.rowDivider]} activeOpacity={0.88}>
                <Ionicons name="time-outline" size={16} color="#9CA3AF" style={styles.listLeadingIcon} />
                <View style={styles.listTextWrap}>
                  <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.listSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { marginBottom: 24 }]}> 
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="trending-up-outline" size={16} color="#6B7280" />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>
          </View>

          <View style={styles.listCard}>
            {trendingSeed.map((item, idx) => (
              <TouchableOpacity key={item.id} style={[styles.listRow, idx !== trendingSeed.length - 1 && styles.rowDivider]} activeOpacity={0.88}>
                <Ionicons name="trending-up-outline" size={16} color="#9CA3AF" style={styles.listLeadingIcon} />
                <View style={styles.listTextWrap}>
                  <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.listSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 92,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrap: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  searchLeadingIcon: {
    marginRight: 10,
  },
  searchInputInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchCameraButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blinkCursor: {
    width: 2,
    height: 18,
    borderRadius: 2,
    backgroundColor: BRAND_GREEN,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 17,
    color: '#111827',
    fontFamily: 'Manrope-Regular',
    paddingVertical: 0,
  },
  pillsRow: {
    paddingTop: 12,
    paddingBottom: 10,
    gap: 8,
  },
  pill: {
    height: 34,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
  },
  pillActive: {
    backgroundColor: '#3A6C57',
    borderColor: '#2E5A4A',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'Manrope-Regular',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  sectionCard: {
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  sectionAction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
  },
  logoRow: {
    paddingHorizontal: 2,
    gap: 8,
  },
  logoTile: {
    width: (width - 24 - 20 - 32) / 5,
    minWidth: 60,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logoImage: {
    width: '78%',
    height: '54%',
    resizeMode: 'contain',
  },
  logoBlank: {
    width: '78%',
    height: '54%',
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  listCard: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    backgroundColor: '#FFFFFF',
  },
  listRow: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  listLeadingIcon: {
    marginRight: 10,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  listSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
  },
});