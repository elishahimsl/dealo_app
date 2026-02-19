import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  Animated,
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DealoWordmarkGreenBlack from '../../../assets/images/logos/dealo-wordmark-greenblack';
import DealoMarkGreen from '../../../assets/images/logos/dealo-mark-green';
import { useRecentScans } from '../../../lib/hooks/use-recent-scans';
import { useSavedProducts } from '../../../lib/hooks/use-saved-products';
import AdBanner from '../../../components/AdBanner';

const BRAND_GREEN = '#0E9F6E';

const { width } = Dimensions.get('window');

const trendingProducts = [
  {
    id: '1',
    name: 'Smart Speaker',
    store: 'Amazon',
    price: '$99.99',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'LA Dodger Hat',
    store: 'Walmart',
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Headphones',
    store: 'Target',
    price: '$149.99',
    image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=800&q=80',
  },
];

const popularComparisons = [
  { id: 'pc1', title: 'Samsung v. iPhone' },
  { id: 'pc2', title: 'AirPods v. Beats' },
  { id: 'pc3', title: 'Adidas v. Nike' },
  { id: 'pc4', title: 'Lenovo v. HP' },
];

function MiniStack() {
  const frontSize = 108;
  const backSize = 104;
  const backX = 72;
  const frontY = 0;
  const backY = 20;
  const stackW = backX + backSize;
  const stackH = Math.max(backY + backSize, frontY + frontSize);

  return (
    <View style={[styles.homeMiniStackWrap, { width: stackW, height: stackH }]}>
      <View
        pointerEvents="none"
        style={[styles.homeMiniBackCard, { width: backSize, height: backSize, left: backX, top: backY }]}
      />
      <View style={[styles.homeMiniFront, { width: frontSize, height: frontSize, left: 0, top: frontY }]} />
    </View>
  );
}

function PopularComparisonTile({ title }: { title: string }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.homePopularTileWrap}>
      <View style={styles.homePopularTileCard}>
        <MiniStack />
        <TouchableOpacity activeOpacity={0.85} style={styles.homePopularTileHeart}>
          <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.homePopularTileTitle} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function RecentlyComparedTile({ title }: { title: string }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.homePopularTileWrap}>
      <View style={styles.homePopularTileCard}>
        <MiniStack />
        <TouchableOpacity activeOpacity={0.85} style={styles.homePopularTileHeart}>
          <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.homePopularTileTitle} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const storeProducts = [
  {
    id: '1',
    name: 'Xbox One',
    store: 'Target',
    price: '$499.99',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'TV 75"',
    store: 'Walmart',
    price: '$799.99',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Headphones',
    store: 'Best Buy',
    price: '$199.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
];

const similarProducts = [
  {
    id: '1',
    name: 'White T-Shirt',
    store: 'Uniqlo',
    price: '$19.99',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Jeans',
    store: 'Amazon',
    price: '$59.99',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Sneakers',
    store: 'Nike',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
];

const brandProducts = [
  {
    id: '1',
    name: 'AirPods Pro',
    store: 'Apple',
    price: '$249.99',
    image: 'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Running Shoes',
    store: 'Nike',
    price: '$109.99',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Denim Jacket',
    store: 'Levi\'s',
    price: '$89.99',
    image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=800&q=80',
  },
];

const navItems = [
  { label: 'Notifications', icon: 'notifications' as const },
  { label: 'Following', icon: 'people-outline' as const },
  { label: 'Saved', icon: 'bookmark-outline' as const },
];

const followChips = [
  { id: 'follow-nike', label: 'Nike', logo: 'N' },
  { id: 'follow-walmart', label: 'Walmart', logo: 'W' },
  { id: 'follow-dyson', label: 'Dyson', logo: 'D' },
];

const dealProducts = [
  { id: 'dp1', name: 'Running Shoes', store: 'Nike', price: '$109.99', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', badge: '25% Off' },
  { id: 'dp2', name: 'AirPods Pro', store: 'Apple', price: '$249.99', image: 'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?auto=format&fit=crop&w=800&q=80', badge: '$10 Off' },
  { id: 'dp3', name: 'Denim Jacket', store: "Levi's", price: '$89.99', image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=800&q=80', badge: '15% Off' },
  { id: 'dp4', name: 'Smart Speaker', store: 'Amazon', price: '$99.99', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80', badge: '$20 Off' },
];

const categoryTiles = [
  { id: 'cat-electronics', label: 'Electronics', icon: 'tv-outline' as const },
  { id: 'cat-furniture', label: 'Furniture', icon: 'bed-outline' as const },
  { id: 'cat-mens', label: "Men's", icon: 'man-outline' as const },
  { id: 'cat-womens', label: "Women's", icon: 'woman-outline' as const },
  { id: 'cat-fashion', label: 'Fashion', icon: 'shirt-outline' as const },
  { id: 'cat-sports', label: 'Sports', icon: 'football-outline' as const },
  { id: 'cat-beauty', label: 'Health & Beauty', icon: 'sparkles-outline' as const },
  { id: 'cat-luxury', label: 'Luxury', icon: 'diamond-outline' as const },
];

export default function Home() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('Categories');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const dealScrollX = useRef(new Animated.Value(0)).current;

  // Real data hooks
  const { scans, refresh: refreshScans } = useRecentScans(6);
  const { items: savedItems, refresh: refreshSaved } = useSavedProducts();

  useFocusEffect(
    useCallback(() => {
      setActiveNav('Categories');
      refreshScans();
      refreshSaved();
    }, [])
  );

  // Convert recent scans to product card format
  const recentScannedProducts = useMemo(() => {
    return scans.map((s) => ({
      id: `scan-${s.id}`,
      name: s.product?.title || 'Scanned Product',
      store: s.product?.brand || 'Unknown',
      price: '',
      image: s.product?.image_urls?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    }));
  }, [scans]);

  interface Product {
    id: string;
    name: string;
    store: string;
    price: string;
    image: string;
  }

  const dealsForYou = [
    { id: 'deal-1', title: '50% Off all Electronics' },
    { id: 'deal-2', title: 'Buy 1 Get 1 on Shoes' },
    { id: 'deal-3', title: 'Extra 20% Off Clearance' },
    { id: 'deal-4', title: 'Weekend Flash Sale' },
  ];

  const dealCardWidth = width - 64;
  const dotStep = 14;
  const dotsWrapWidth = 18 + (dealsForYou.length - 1) * dotStep;
  const activeDotTranslateX = dealScrollX.interpolate({
    inputRange: dealsForYou.map((_, i) => i * dealCardWidth),
    outputRange: dealsForYou.map((_, i) => i * dotStep),
    extrapolate: 'clamp',
  });

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(tabs)/products' as Href)} style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity
          style={[styles.heartIcon, liked[item.id] ? styles.heartIconActive : null]}
          activeOpacity={0.85}
          onPress={() => setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
        >
          <Ionicons name={liked[item.id] ? 'heart' : 'heart-outline'} size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.productMetaRow}>
        <View style={styles.productLogoPlaceholder} />
        <View style={styles.productTextCol}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productStore} numberOfLines={1}>
            {item.store}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <DealoWordmarkGreenBlack width={120} height={26} />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.85} onPress={() => router.push('/account' as Href)}>
            <Ionicons name="person" size={22} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchContainer} onPress={() => router.push('/search' as Href)}>
          <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search" 
            placeholderTextColor="#6B7280" 
            editable={false}
            pointerEvents="none"
          />
          <TouchableOpacity style={styles.searchCameraButton} onPress={() => router.push('/(tabs)/camera' as Href)}>
            <Ionicons name="camera-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Navigation Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navContainer}>
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.navItem, activeNav === item.label && styles.activeNavItem]}
              onPress={() => {
                setActiveNav(item.label);
                if (item.label === 'Notifications') router.push('/home/notifications' as any);
                if (item.label === 'Saved') router.push('/home/saved');
                if (item.label === 'Following') router.push('/home/following');
              }}
              activeOpacity={0.85}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={BRAND_GREEN}
                style={styles.navIcon}
              />
              <Text style={[styles.navText, activeNav === item.label && styles.activeNavText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Snap to Search Card */}
        <TouchableOpacity style={styles.snapCard} activeOpacity={0.9} onPress={() => router.replace('/(tabs)/camera' as Href)}>
          <View style={styles.snapTop}>
            <View style={styles.snapIllustration}>
              <View style={[styles.starDot, { top: 18, left: 24, opacity: 0.35 }]} />
              <View style={[styles.starDot, { top: 42, right: 38, opacity: 0.25 }]} />
              <View style={[styles.starDot, { bottom: 28, left: 56, opacity: 0.2 }]} />
              <View style={styles.illusCameraWrapper}>
                <Ionicons name="camera" size={60} color="rgba(255,255,255,0.28)" />
              </View>
              <View style={styles.illusTagWrapper}>
                <Ionicons name="pricetag" size={44} color={BRAND_GREEN} />
              </View>
            </View>
          </View>
          <View style={styles.snapBottom}>
            <View style={styles.snapBottomIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
            <Text style={styles.snapBottomText}>Snap a picture to get started</Text>
          </View>
        </TouchableOpacity>

        {/* Try Scanning These */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Try Scanning These</Text>
          </View>
          <FlatList
            data={trendingProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        <View style={[styles.section, { marginTop: 18 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Popular comparisons</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/compare/popularComparisons?returnTo=/home' as Href)}
            >
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.homePopularRowContent}>
            {popularComparisons.map((c) => (
              <PopularComparisonTile key={c.id} title={c.title} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Recently Scanned</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/home/saved' as Href)}
            >
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentScannedProducts.length > 0 ? recentScannedProducts : similarProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Recently Compared</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/account/recents?filter=compared&returnTo=/home' as Href)}
            >
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.homePopularRowContent}>
            {popularComparisons.map((c) => (
              <RecentlyComparedTile key={`rc-${c.id}`} title={c.title} />
            ))}
          </ScrollView>
        </View>

        <AdBanner style={{ marginHorizontal: 16, marginVertical: 4 }} />

        {/* Smart Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Smart Suggestions</Text>
          </View>
          <Text style={styles.smallSectionTitle}>From Stores You Liked</Text>
          <FlatList
            data={storeProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        {/* Similar to What You Liked */}
        <View style={[styles.section, { marginTop: 10, marginBottom: 6 }]}>
          <Text style={styles.smallSectionTitle}>Similar to What You Liked</Text>
          <FlatList
            data={similarProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        <View style={[styles.section, { marginTop: 18, marginBottom: 24 }]}>
          <Text style={styles.smallSectionTitle}>From Brands you liked</Text>
          <FlatList
            data={brandProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        <View style={styles.homeMockSection}>
          <View style={styles.homeMockHeaderRow}>
            <Text style={styles.homeMockTitle}>Deals For You</Text>
            <View style={styles.homeMockHeaderRight}>
              <View style={styles.homeMockLogoStack}>
                <View style={[styles.homeMockLogoCircle, styles.homeMockLogoCircleBack]}>
                  <Ionicons name="logo-apple" size={16} color="#111827" />
                </View>
                <View style={[styles.homeMockLogoCircle, styles.homeMockLogoCircleMid]}>
                  <Ionicons name="logo-amazon" size={16} color="#111827" />
                </View>
                <View style={[styles.homeMockLogoCircle, styles.homeMockLogoCircleFront]}>
                  <Ionicons name="logo-google" size={16} color="#111827" />
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.replace('/(tabs)/deals' as Href)}>
                <Ionicons name="chevron-forward" size={18} color="#111827" />
              </TouchableOpacity>
            </View>
          </View>

          <Animated.FlatList
            data={dealsForYou}
            keyExtractor={(d) => d.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={dealCardWidth}
            disableIntervalMomentum
            bounces={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: dealScrollX } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            contentContainerStyle={styles.homeMockDealCarousel}
            renderItem={({ item }) => (
              <View style={[styles.homeMockDealCard, { width: dealCardWidth }]}>
                <View style={styles.homeMockDealPin}>
                  <Ionicons name="pricetag" size={14} color="#111827" />
                </View>
                <Text style={styles.homeMockDealText}>{item.title}</Text>
              </View>
            )}
          />

          {/* Deal Product Tiles - 2 rows of 2 */}
          <View style={styles.dealProductsGrid}>
            {dealProducts.map((dp) => (
              <View key={dp.id} style={styles.dealProductTile}>
                <View style={styles.dealProductImageWrap}>
                  <Image source={{ uri: dp.image }} style={styles.dealProductImage} />
                  <View style={styles.dealBadge}>
                    <Text style={styles.dealBadgeText}>{dp.badge}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.dealHeartIcon, liked[dp.id] ? styles.heartIconActive : null]}
                    activeOpacity={0.85}
                    onPress={() => setLiked((prev) => ({ ...prev, [dp.id]: !prev[dp.id] }))}
                  >
                    <Ionicons name={liked[dp.id] ? 'heart' : 'heart-outline'} size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.productMetaRow}>
                  <View style={styles.productLogoPlaceholder} />
                  <View style={styles.productTextCol}>
                    <Text style={styles.productName} numberOfLines={1}>{dp.name}</Text>
                    <Text style={styles.productStore} numberOfLines={1}>{dp.store}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.homeMockHeaderRowTight}>
            <Text style={styles.homeMockSubTitle}>Stores and Brands</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.replace('/discover' as Href)}>
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.homeMockFollowRow}>
            {followChips.map((c) => (
              <View key={c.id} style={styles.homeMockFollowTile}>
                <View style={styles.homeMockFollowTileRow}>
                  <View style={styles.homeMockFollowLogoCircle}>
                    <Text style={styles.homeMockFollowLogoText}>{c.logo}</Text>
                  </View>
                  <View style={styles.homeMockFollowInfo}>
                    <Text style={styles.homeMockFollowLabel}>{c.label}</Text>
                    <TouchableOpacity activeOpacity={0.85} style={[styles.homeMockFollowBtnGreen, following[c.id] && { backgroundColor: '#E5E7EB' }]} onPress={() => setFollowing((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}>
                      <Text style={[styles.homeMockFollowBtnGreenText, following[c.id] && { color: '#6B7280' }]}>{following[c.id] ? 'Following' : 'Follow'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <DealoMarkGreen width={20} height={22} />
          </View>
          <Text style={styles.footerTagline}>Shop Smart. Save Big.</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
    backdropFilter: 'blur(20px)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
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
  navContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    backdropFilter: 'blur(10px)',
  },
  activeNavItem: {
    backgroundColor: '#F3F4F6',
  },
  navIcon: {
    marginRight: 8,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  activeNavText: {
    color: '#111827',
  },
  snapCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#111B3A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  snapTop: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapIllustration: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  illusCameraWrapper: {
    position: 'absolute',
    left: width * 0.18,
    top: 50,
    transform: [{ rotate: '-10deg' }],
  },
  illusTagWrapper: {
    position: 'absolute',
    right: width * 0.18,
    top: 66,
    transform: [{ rotate: '18deg' }],
  },
  snapBottom: {
    height: 72,
    backgroundColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  snapBottomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  snapBottomText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginTop: 24,
  },
  sectionTitleNoPad: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  snapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  snapSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  smallSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  productsContainer: {
    paddingLeft: 20,
    paddingRight: 6,
  },
  homePopularRowContent: {
    paddingLeft: 18,
    paddingRight: 18,
    gap: 16,
  },
  homePopularTileWrap: {
    width: 238,
    marginBottom: 0,
  },
  homePopularTileCard: {
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
  homePopularTileHeart: {
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
  homePopularTileTitle: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  homeMiniStackWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  homeMiniBackCard: {
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
  homeMiniFront: {
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
  homeMockSection: {
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 6,
  },
  homeMockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  homeMockHeaderRowTight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 14,
  },
  homeMockTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  homeMockSubTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
    marginBottom: 0,
  },
  homeMockViewAll: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_GREEN,
    opacity: 0.9,
  },
  homeMockHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeMockLogoStack: {
    width: 70,
    height: 26,
    position: 'relative',
  },
  homeMockLogoCircle: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  homeMockLogoCircleBack: {
    left: 0,
    top: 0,
  },
  homeMockLogoCircleMid: {
    left: 17,
    top: 0,
  },
  homeMockLogoCircleFront: {
    left: 34,
    top: 0,
  },
  homeMockDealCard: {
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    padding: 18,
    marginRight: 12,
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  homeMockDealCarousel: {
    paddingRight: 16,
  },
  homeMockDealPin: {
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
  homeMockDealText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  dealProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
    gap: 12,
    marginTop: 22,
    marginBottom: 6,
  },
  dealProductTile: {
    width: (width - 32 - 12) / 2,
    marginBottom: 4,
  },
  dealProductImageWrap: {
    width: '100%',
    height: 142,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  dealProductImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: BRAND_GREEN,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dealBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  homeMockDotsWrap: {
    height: 6,
    alignSelf: 'center',
    position: 'relative',
  },
  homeMockDotsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingLeft: 6,
  },
  homeMockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(17,24,39,0.25)',
  },
  homeMockDotActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 18,
    height: 6,
    borderRadius: 99,
    backgroundColor: BRAND_GREEN,
  },
  homeMockFollowRow: {
    paddingRight: 12,
    gap: 12,
  },
  homeMockFollowTile: {
    width: 176,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
  },
  homeMockFollowTileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  homeMockFollowLogoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeMockFollowLogoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  homeMockFollowInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  homeMockFollowLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  homeMockFollowBtnGreen: {
    height: 28,
    borderRadius: 8,
    backgroundColor: BRAND_GREEN,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  homeMockFollowBtnGreenText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  homeMockCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  homeMockCategoriesFrame: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  homeMockCategoryCell: {
    width: '25%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeMockCategoryCellRight: {
    borderRightWidth: 0,
    borderRightColor: 'transparent',
  },
  homeMockCategoryCellBottom: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  homeMockCategoryIconBare: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  homeMockCategoryLabelBare: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    opacity: 0.85,
    textAlign: 'center',
  },
  productCard: {
    width: 150,
    marginRight: 14,
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
  },
  heartIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(17,24,39,0.45)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealHeartIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(17,24,39,0.45)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIconActive: {
    backgroundColor: BRAND_GREEN,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productStore: {
    fontSize: 10,
    color: '#6B7280',
  },
  productMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  productLogoPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.10)',
    marginTop: 0,
  },
  productTextCol: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 34,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.35,
    marginBottom: 8,
  },
  footerTagline: {
    fontSize: 16,
    fontWeight: '300',
    color: '#9CA3AF',
    opacity: 0.6,
    letterSpacing: -0.2,
  },
});
