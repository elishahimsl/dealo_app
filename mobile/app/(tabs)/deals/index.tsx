import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#0E9F6E';

type Deal = {
  id: string;
  brand: string;
  product: string;
  category: string;
  badge: string;
  image: string;
};

const FILTERS = ['For You', 'Hot Deals', 'Trending'] as const;

const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    brand: 'Samsung',
    product: '75" Smart TV',
    category: 'Electronics',
    badge: '20% Off',
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    brand: 'Apple',
    product: 'MacBook Pro',
    category: 'Computers',
    badge: '$30 Off',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    brand: 'Sony',
    product: 'Noise Cancelling Headphones',
    category: 'Audio',
    badge: 'Buy 2 50% Off',
    image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    brand: 'IKEA',
    product: 'Modern Sofa',
    category: 'Furniture',
    badge: '15% Off',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    brand: 'Bose',
    product: 'Wireless Speaker',
    category: 'Audio',
    badge: '$10 Off',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    brand: 'KitchenAid',
    product: 'Stand Mixer',
    category: 'Kitchen',
    badge: '25% Off',
    image: 'https://images.unsplash.com/photo-1514516430039-0f2b57d4f2e8?auto=format&fit=crop&w=900&q=80',
  },
];

type DealOfDayCard = {
  id: string;
  brand: string;
  product: string;
  discount: string;
  price: string;
  oldPrice: string;
  image: string;
};

const DEAL_OF_DAY_FEATURED: DealOfDayCard = {
  id: 'day-1',
  brand: 'Sony',
  product: 'Black Headphones',
  discount: '25% off',
  price: '$75.00',
  oldPrice: '$99.00',
  image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=900&q=80',
};

type DealSponsoredCard = {
  id: string;
  brand: string;
  deal: string;
  image: string;
  logo: string;
};

const DEAL_DAY_SPONSORED_CARDS: DealSponsoredCard[] = [
  {
    id: 's-day-1',
    brand: 'Adidas',
    deal: '20% off all shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    logo: 'A',
  },
  {
    id: 's-day-2',
    brand: 'Nike',
    deal: '30% off running gear',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    logo: 'N',
  },
  {
    id: 's-day-3',
    brand: 'Samsung',
    deal: '18% off Galaxy Buds',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80',
    logo: 'S',
  },
];

export default function Deals() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('For You');
  const dealDayCardWidth = width - 34;

  const data = MOCK_DEALS;

  const sectionTitle = useMemo(() => {
    if (activeFilter === 'Hot Deals') return 'Best Deals Right Now';
    if (activeFilter === 'Trending') return 'Popular Deals Right Now';
    return 'Deals based on your interests';
  }, [activeFilter]);

  const renderItem = ({ item }: ListRenderItemInfo<Deal>) => {
    return (
      <View style={styles.tile}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{item.badge}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} style={styles.heartBtn}>
            <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.brandCircle}>
            <Text style={styles.brandCircleText}>{item.brand.slice(0, 1).toUpperCase()}</Text>
          </View>

          <View style={styles.metaTextWrap}>
            <Text numberOfLines={1} style={styles.metaBrand}>
              {item.brand}
            </Text>
            <Text numberOfLines={1} style={styles.metaProduct}>
              {item.product}
            </Text>
            <Text numberOfLines={1} style={styles.metaCategory}>
              {item.category}
            </Text>
          </View>
        </View>

        <View style={styles.reactions}>
          <TouchableOpacity activeOpacity={0.85} style={styles.reactionBtn}>
            <Ionicons name="thumbs-up" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.reactionBtn}>
            <Ionicons name="thumbs-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
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
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Deals</Text>
            </View>

            <TouchableOpacity style={styles.searchRow} activeOpacity={0.9} onPress={() => router.push('/(tabs)/search')}>
              <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
              <Text style={styles.searchInput}>Search</Text>
              <View style={styles.searchCameraButton}>
                <Ionicons name="camera-outline" size={18} color={BRAND_GREEN} />
              </View>
            </TouchableOpacity>

            <View style={styles.filterRow}>
              {FILTERS.map((f) => {
                const active = f === activeFilter;
                return (
                  <TouchableOpacity
                    key={f}
                    activeOpacity={0.9}
                    onPress={() => setActiveFilter(f)}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.dealOfDayHead}>
              <Text style={styles.dealOfDayTitle}>Deal of the Day</Text>
            </View>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={dealDayCardWidth + 12}
              disableIntervalMomentum
              bounces={false}
              contentContainerStyle={styles.dealDayCarousel}
            >
              <View style={[styles.dealDayCard, { width: dealDayCardWidth }]}> 
                <View style={styles.dealDayRow}>
                  <View style={styles.dealDayLeft}>
                    <View style={styles.dealDayPill}>
                      <Ionicons name="pricetag-outline" size={12} color="#111827" />
                      <Text style={styles.dealDayPillText}>{DEAL_OF_DAY_FEATURED.discount}</Text>
                    </View>

                    <Text style={styles.dealDayBrand}>{DEAL_OF_DAY_FEATURED.brand}</Text>
                    <Text style={styles.dealDayProduct}>{DEAL_OF_DAY_FEATURED.product}</Text>

                    <View style={styles.dealDayPriceRow}>
                      <Text style={styles.dealDayPrice}>{DEAL_OF_DAY_FEATURED.price}</Text>
                      <Text style={styles.dealDayOldPrice}>{DEAL_OF_DAY_FEATURED.oldPrice}</Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.dealDayBtn}
                      onPress={() => router.push('/(tabs)/products')}
                    >
                      <Text style={styles.dealDayBtnText}>Get Deal</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dealDayImageWrap}>
                    <Image source={{ uri: DEAL_OF_DAY_FEATURED.image }} style={styles.dealDayImage} />
                  </View>
                </View>
              </View>

              {DEAL_DAY_SPONSORED_CARDS.map((card) => (
                <View key={card.id} style={[styles.dealDaySponsoredCard, { width: dealDayCardWidth }]}> 
                  <View style={styles.dealDaySponsoredImageWrap}>
                    <Text style={styles.dealDaySponsoredLabel}>Sponsored</Text>
                    <Image source={{ uri: card.image }} style={styles.dealDaySponsoredImage} />
                  </View>

                  <View style={styles.dealDaySponsoredBottom}>
                    <View style={styles.dealDaySponsoredLogoCircle}>
                      <Text style={styles.dealDaySponsoredLogoText}>{card.logo}</Text>
                    </View>
                    <View style={styles.dealDaySponsoredTextCol}>
                      <Text style={styles.dealDaySponsoredBrand}>{card.brand}</Text>
                      <Text style={styles.dealDaySponsoredDeal}>{card.deal}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.sectionAction}>
                <View style={[styles.filterIcon, styles.filterIconFlipped]}>
                  <View style={[styles.filterLine, styles.filterLine1]} />
                  <View style={[styles.filterLine, styles.filterLine2]} />
                  <View style={[styles.filterLine, styles.filterLine3]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  list: {},

  listContent: {
    paddingBottom: 28,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  featuredDeal: {
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    padding: 18,
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  featuredDealPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featuredDealText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  searchCameraButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
    gap: 8,
  },
  dealOfDayHead: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 10,
  },
  dealOfDayTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.1,
  },
  dealDayCarousel: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  dealDayCard: {
    marginRight: 12,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    padding: 14,
    minHeight: 166,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  dealDayRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    flex: 1,
  },
  dealDayLeft: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 2,
  },
  dealDayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
    gap: 5,
  },
  dealDayPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  dealDayBrand: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 18,
  },
  dealDayProduct: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
    marginBottom: 6,
  },
  dealDayPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  dealDayPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  dealDayOldPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  dealDayBtn: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  dealDayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealDayImageWrap: {
    width: 108,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  dealDayImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dealDaySponsoredCard: {
    marginRight: 12,
    borderRadius: 22,
    backgroundColor: '#111827',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  dealDaySponsoredImageWrap: {
    height: 154,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dealDaySponsoredLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    zIndex: 2,
  },
  dealDaySponsoredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.88,
  },
  dealDaySponsoredBottom: {
    height: 72,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  dealDaySponsoredLogoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealDaySponsoredLogoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  dealDaySponsoredTextCol: {
    flex: 1,
  },
  dealDaySponsoredBrand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  dealDaySponsoredDeal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
    maxWidth: '82%',
  },
  sectionAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  column: {
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    gap: 20,
  },
  tile: {
    width: (width - 48) / 2,
    marginBottom: 22,
  },
  imageWrap: {
    width: '100%',
    height: 162,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  discountBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: BRAND_GREEN,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  discountBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 18,
    height: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
  filterIconFlipped: {
    transform: [{ scaleX: -1 }],
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  brandCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandCircleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  metaTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  metaBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.15,
  },
  metaProduct: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.15,
  },
  metaCategory: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: -0.15,
  },
  reactions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  reactionBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
