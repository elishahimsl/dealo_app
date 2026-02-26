import React, { useEffect, useRef, useState } from 'react';
import {
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

  const [query, setQuery] = useState('');
  const [activePill, setActivePill] = useState('Electronics');
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const [recentSearches, setRecentSearches] = useState(recentSearchesSeed);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

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
            <Ionicons name="search" size={18} color="#6B7280" style={styles.searchLeadingIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor="#6B7280"
              returnKeyType="search"
            />
            <View style={styles.searchCameraButton}>
              <Ionicons name="camera-outline" size={20} color="#6B7280" />
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

        <View style={styles.sheet}>
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <Ionicons name="time-outline" size={17} color="#6B7280" />
                <Text style={styles.sectionTitle}>Popular Stores</Text>
              </View>
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

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <Ionicons name="logo-apple" size={17} color="#6B7280" />
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

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <Ionicons name="time-outline" size={17} color="#6B7280" />
                <Text style={styles.sectionTitle}>Recent Searches</Text>
              </View>
            </View>

            <View style={styles.flatListGroup}>
              {recentSearches.map((item, idx) => (
                <TouchableOpacity key={item.id} style={[styles.listRow, idx !== recentSearches.length - 1 && styles.rowDivider]} activeOpacity={0.88}>
                  <Image source={{ uri: item.image }} style={styles.rowThumb} />
                  <View style={styles.listTextWrap}>
                    <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.listSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setRecentSearches((prev) => prev.filter((s) => s.id !== item.id))}
                  >
                    <Ionicons name="close" size={24} color="#111827" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.sectionBlock, { marginBottom: 6 }]}> 
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.trendingEmoji}>🔥</Text>
                <Text style={styles.sectionTitle}>Trending Now</Text>
              </View>
            </View>

            <View style={styles.flatListGroup}>
              {trendingSeed.map((item, idx) => (
                <TouchableOpacity key={item.id} style={[styles.listRow, idx !== trendingSeed.length - 1 && styles.rowDivider]} activeOpacity={0.88}>
                  <Image source={{ uri: item.image }} style={styles.rowThumb} />
                  <View style={styles.listTextWrap}>
                    <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.listSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
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
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  searchLeadingIcon: {
    marginRight: 10,
  },
  searchCameraButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
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
  sheet: {
    marginTop: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 38/2,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  trendingEmoji: {
    fontSize: 17,
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
  flatListGroup: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8F8FA',
  },
  listRow: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  rowThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#ECEEF2',
    marginRight: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  listSubtitle: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    fontFamily: 'Manrope-Regular',
  },
});