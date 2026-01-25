import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';

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

const interestTiles = [
  {
    id: 'men',
    label: 'Men',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'women',
    label: 'Women',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'fashion',
    label: 'Fashion',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'tech',
    label: 'Tech',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'health',
    label: 'Health',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'sports',
    label: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'home',
    label: 'Home',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
  {
    id: 'gifts',
    label: 'Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&h=300&q=80&crop=right',
  },
];

const trending = [
  {
    id: 't1',
    title: 'Smart Fitness\nWatch',
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 't2',
    title: 'Noise-Cancelling\nEarbuds',
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 't3',
    title: 'Wireless\nVacuum',
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

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logoPage, setLogoPage] = useState(0);
  const router = useRouter();

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

  const half = useMemo(() => (width - 20 * 2 - 12) / 2, []);
  const full = useMemo(() => width - 20 * 2, []);
  const renderTrending = ({ item }: { item: (typeof trending)[number] }) => (
    <View style={styles.trendingWrapper}>
      <TouchableOpacity style={styles.trendingCard} activeOpacity={0.9}>
        <Image source={{ uri: item.image }} style={styles.trendingImage} />
      </TouchableOpacity>
      <Text style={styles.trendingTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.trendingCategory}>{item.category}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => router.push('/search' as Href)}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <Text style={styles.searchInput}>Search</Text>
          <TouchableOpacity style={styles.searchCameraButton} onPress={() => router.push('/camera' as Href)}>
            <Ionicons name="camera-outline" size={18} color="#0E9F6E" />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.sectionPad}>
          <Text style={styles.sectionHeaderTitle}>Explore by interest</Text>
          <View style={styles.interestGrid}>
            {interestTiles.map((t) => (
              <TouchableOpacity key={t.id} style={[styles.interestTile, { width: half }]} activeOpacity={0.9}>
                <ImageBackground source={{ uri: t.image }} style={styles.interestBg} imageStyle={styles.interestBgImage}>
                  <View style={styles.interestOverlay} />
                  <Text style={styles.interestLabel}>{t.label}</Text>
                </ImageBackground>
              </TouchableOpacity>
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
            data={trending}
            renderItem={renderTrending}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
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
            snapToInterval={width}
            snapToAlignment="start"
            disableIntervalMomentum
            bounces={false}
            onMomentumScrollEnd={(e) => {
              const next = Math.round(e.nativeEvent.contentOffset.x / width);
              setLogoPage(Math.max(0, Math.min(totalPages - 1, next)));
            }}
            renderItem={({ item }) => (
              <View style={[styles.logoPage, { width }]}> 
                <View style={styles.logoGrid}>
                  {item.map((l) => (
                    <View key={l.id} style={styles.logoTile}>
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
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  searchCameraButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
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
    paddingHorizontal: 20,
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
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  interestTile: {
    height: 80,
    width: '48%',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
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
    backgroundColor: '#0E9F6E',
  },
  interestBg: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    alignItems: 'flex-start',
  },
  interestBgImage: {
    borderRadius: 6,
    width: 86,
    height: 86,
    position: 'absolute',
    right: -14,
    bottom: -14,
    transform: [{ rotate: '15deg' }],
    opacity: 0.7,
  },
  interestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  interestLabel: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  trendingList: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  trendingWrapper: {
    marginRight: 20,
  },
  trendingCard: {
    width: 140,
    borderRadius: 12,
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
    height: 140,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  trendingCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  logoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  logoTile: {
    width: (width - 60) / 3,
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
    fontWeight: '900',
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
    fontWeight: '900',
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
    fontWeight: '900',
    color: '#0E9F6E',
  },
  footerBrand: {
    textAlign: 'center',
    marginTop: 36,
    fontSize: 34,
    fontWeight: '900',
    color: '#9CA3AF',
    opacity: 0.55,
  },
});
