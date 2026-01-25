import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';
const { width } = Dimensions.get('window');

type FeaturedDeal = {
  id: string;
  store: string;
  price: string;
  oldPrice: string;
  title: string;
  image: string;
  tag: string;
};

type DroppedDeal = {
  id: string;
  image: string;
  priceTag: string;
};

export default function PriceDrop() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const featured = useMemo<FeaturedDeal[]>(
    () => [
      {
        id: 'f1',
        store: 'Target',
        price: '$219.99',
        oldPrice: '$349.99',
        title: '4K Smart TV',
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1400&q=80',
        tag: 'Trending',
      },
      {
        id: 'f2',
        store: 'Best Buy',
        price: '$149.99',
        oldPrice: '$199.99',
        title: 'Noise-Canceling Headphones',
        image: 'https://images.unsplash.com/photo-1518441311536-2f1e4f05b3b5?auto=format&fit=crop&w=1400&q=80',
        tag: 'Hot',
      },
      {
        id: 'f3',
        store: 'Amazon',
        price: '$89.99',
        oldPrice: '$129.99',
        title: 'Smart Speaker',
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1400&q=80',
        tag: 'Deal',
      },
    ],
    []
  );

  const recentlyViewed = useMemo(
    () => [
      {
        id: 'rv1',
        image: 'https://images.unsplash.com/photo-1518441902117-f0a2a3b7a3dd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'rv2',
        image: 'https://images.unsplash.com/photo-1518441311536-2f1e4f05b3b5?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'rv3',
        image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    []
  );

  const recentlyDropped = useMemo<DroppedDeal[]>(
    () => [
      {
        id: 'rd1',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80',
        priceTag: '$1,799',
      },
      {
        id: 'rd2',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=80',
        priceTag: '$899',
      },
      {
        id: 'rd3',
        image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1400&q=80',
        priceTag: '$129',
      },
      {
        id: 'rd4',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80',
        priceTag: '$199',
      },
      {
        id: 'rd5',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
        priceTag: '$249',
      },
      {
        id: 'rd6',
        image: 'https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1400&q=80',
        priceTag: '$99',
      },
    ],
    []
  );

  const featuredWidth = width - 18 * 2;
  const featuredInterval = featuredWidth + 14;
  const slideCount = featured.length;
  const droppedWidth = (width - 18 * 2 - 12) / 2;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PriceDrop</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search products..."
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchCameraButton} activeOpacity={0.85}>
              <Ionicons name="camera-outline" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuredPager}>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            decelerationRate="fast"
            snapToInterval={featuredInterval}
            snapToAlignment="start"
            disableIntervalMomentum
            ItemSeparatorComponent={() => <View style={styles.featuredSeparator} />}
            onMomentumScrollEnd={(e) => {
              const next = Math.round(e.nativeEvent.contentOffset.x / featuredInterval);
              setActiveSlide(Math.max(0, Math.min(slideCount - 1, next)));
            }}
            renderItem={({ item }) => (
              <View style={[styles.featuredCard, { width: featuredWidth }]}>
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay} />

                <View style={styles.featuredTopRight}>
                  <View style={styles.featuredTag}>
                    <Text style={styles.featuredTagText}>{item.tag}</Text>
                  </View>
                </View>

                <View style={styles.featuredBottomRow}>
                  <View style={styles.featuredLeft}>
                    <View style={styles.storeRow}>
                      <View style={styles.storeDot} />
                      <Text style={styles.storeText}>{item.store}</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>{item.price}</Text>
                      <Text style={styles.oldPriceText}>{item.oldPrice}</Text>
                    </View>
                    <Text style={styles.productTitle}>{item.title}</Text>
                  </View>

                  <TouchableOpacity style={styles.analyzeButton} activeOpacity={0.9}>
                    <Text style={styles.analyzeText}>Analyze</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.dotsRow}>
          {featured.map((_s, idx) => (
            <View key={`dot-${idx}`} style={[styles.dot, idx === activeSlide ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          <TouchableOpacity style={styles.sectionArrow} activeOpacity={0.85}>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.recentRow}>
          {recentlyViewed.map((r) => (
            <View key={r.id} style={styles.recentTile}>
              <Image source={{ uri: r.image }} style={styles.recentImage} />
            </View>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recently Dropped</Text>
          <TouchableOpacity style={styles.sectionArrow} activeOpacity={0.85}>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.droppedRow}>
          {recentlyDropped.map((d) => (
            <TouchableOpacity key={d.id} style={[styles.droppedCard, { width: droppedWidth }]} activeOpacity={0.9}>
              <Image source={{ uri: d.image }} style={styles.droppedImage} />
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>{d.priceTag}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 40,
  },
  header: {
    height: 46,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  headerRight: {
    width: 34,
  },
  searchWrap: {
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  searchBar: {
    height: 40,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 9,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  searchCameraButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featuredPager: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  featuredCard: {
    height: 170,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 10,
  },
  featuredSeparator: {
    width: 14,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 104,
    backgroundColor: 'rgba(17,24,39,0.68)',
  },
  featuredTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  featuredTag: {
    height: 22,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: BRAND_GREEN,
  },
  featuredTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  featuredBottomRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  featuredLeft: {
    flex: 1,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  storeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 10,
  },
  storeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  oldPriceText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'line-through',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  analyzeButton: {
    height: 30,
    borderRadius: 10,
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 12,
    justifyContent: 'center',
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  analyzeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  dotsRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  dotActive: {
    width: 18,
    height: 6,
    backgroundColor: BRAND_GREEN,
  },
  dotInactive: {
    backgroundColor: '#D1D5DB',
  },

  sectionHeaderRow: {
    marginTop: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  sectionArrow: {
    padding: 6,
  },

  recentRow: {
    paddingHorizontal: 18,
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  recentTile: {
    width: (width - 18 * 2 - 12 * 2) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 7,
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },

  droppedRow: {
    paddingHorizontal: 18,
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  droppedCard: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 9,
  },
  droppedImage: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    left: 10,
    top: 10,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(17,24,39,0.68)',
    justifyContent: 'center',
  },
  priceTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});
