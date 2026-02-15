import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Image, Dimensions, type LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';
const { width } = Dimensions.get('window');

type Product = {
  id: string;
  name: string;
  store: string;
  image: string;
};

const pills = ['All', 'Recommended', 'Trending', 'Mens', 'Womens', 'Fashion', 'Tech', 'Home', 'Health', 'Sports', 'Gifts'] as const;

const trendingProducts: Product[] = [
  {
    id: 'trending-1',
    name: 'Nike AlphaFly’s',
    store: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trending-2',
    name: 'VIZIO 72" TV OLED',
    store: 'Vizio',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trending-3',
    name: 'Doco Brown Lamp',
    store: 'Doco',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
];

const mensProducts: Product[] = [
  {
    id: 'mens-1',
    name: 'Everyday Hoodie',
    store: 'Nike',
    image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mens-2',
    name: 'Running Sneakers',
    store: 'Adidas',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mens-3',
    name: 'Classic Watch',
    store: 'Casio',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
];

const womensProducts: Product[] = [
  {
    id: 'womens-1',
    name: 'Everyday Tote',
    store: 'Coach',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'womens-2',
    name: 'Cozy Sweater',
    store: 'Uniqlo',
    image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'womens-3',
    name: 'Signature Perfume',
    store: 'Chanel',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  },
];

const recommendedProducts: Product[] = [
  {
    id: 'rec-1',
    name: "Ashley’s Chair Brown",
    store: 'Ashley',
    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rec-2',
    name: 'Stanley Pink Cup',
    store: 'Stanley',
    image: 'https://images.unsplash.com/photo-1526406915894-6c228685b4d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rec-3',
    name: 'Tiktok 15 lb Weights',
    store: 'Tiktok',
    image: 'https://images.unsplash.com/photo-1595079835229-0b84d8026a26?auto=format&fit=crop&w=800&q=80',
  },
];

const fashionProducts: Product[] = [
  {
    id: 'fashion-1',
    name: 'Denim Jacket',
    store: "Levi’s",
    image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fashion-2',
    name: 'White T-Shirt',
    store: 'Uniqlo',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fashion-3',
    name: 'LA Dodger Hat',
    store: 'Walmart',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
  },
];

const techProducts: Product[] = [
  {
    id: 'tech-1',
    name: 'Noise Cancelling Headphones',
    store: 'Sony',
    image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tech-2',
    name: 'Smart Fitness Watch',
    store: 'Apple',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tech-3',
    name: 'Wireless Speaker',
    store: 'Bose',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  },
];

const homeProducts: Product[] = [
  {
    id: 'home-1',
    name: 'Wireless Vacuum',
    store: 'Dyson',
    image: 'https://images.unsplash.com/photo-1581578029523-3f5b3c52db64?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'home-2',
    name: 'Modern Sofa',
    store: 'IKEA',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'home-3',
    name: 'Stand Mixer',
    store: 'KitchenAid',
    image: 'https://images.unsplash.com/photo-1514516430039-0f2b57d4f2e8?auto=format&fit=crop&w=800&q=80',
  },
];

const healthProducts: Product[] = [
  {
    id: 'health-1',
    name: 'Recovery Massage Gun',
    store: 'Theragun',
    image: 'https://images.unsplash.com/photo-1615485737651-580f4e3ee7f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'health-2',
    name: 'Smart Scale',
    store: 'Withings',
    image: 'https://images.unsplash.com/photo-1584467735871-8d8b92de6b10?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'health-3',
    name: 'Everyday Supplements',
    store: 'Ritual',
    image: 'https://images.unsplash.com/photo-1585238342028-96612a3d82f6?auto=format&fit=crop&w=800&q=80',
  },
];

const sportsProducts: Product[] = [
  {
    id: 'sports-1',
    name: 'Training Shoes',
    store: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sports-2',
    name: 'Fitness Weights',
    store: 'Bowflex',
    image: 'https://images.unsplash.com/photo-1595079835229-0b84d8026a26?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sports-3',
    name: 'Yoga Mat',
    store: 'Lululemon',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cfcc6f?auto=format&fit=crop&w=800&q=80',
  },
];

const giftsProducts: Product[] = [
  {
    id: 'gifts-1',
    name: 'Gift Box Set',
    store: 'Etsy',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gifts-2',
    name: 'Wireless Headphones',
    store: 'Beats',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gifts-3',
    name: 'Cozy Hoodie',
    store: 'Adidas',
    image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=800&q=80',
  },
];

function getInitial(label: string) {
  const trimmed = label.trim();
  return trimmed ? trimmed[0]?.toUpperCase() ?? '' : '';
}

function FilterGlyph() {
  return (
    <View style={[styles.filterIcon, styles.filterIconFlipped]}>
      <View style={[styles.filterLine, styles.filterLine1]} />
      <View style={[styles.filterLine, styles.filterLine2]} />
      <View style={[styles.filterLine, styles.filterLine3]} />
    </View>
  );
}

export default function DiscoverProducts() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pill?: string; returnTo?: string }>();
  const [activePill, setActivePill] = useState<(typeof pills)[number]>('All');
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const navRef = useRef<ScrollView>(null);
  const pillX = useRef<Record<string, number>>({});

  const scrollPillIntoView = (label: (typeof pills)[number]) => {
    const x = pillX.current[label];
    if (typeof x !== 'number') return;
    navRef.current?.scrollTo({ x: Math.max(0, x - 16), animated: true });
  };

  const returnTo = (params.returnTo ?? '').toString().trim();
  const selfHref = returnTo
    ? (`/compare/discoverProducts?returnTo=${encodeURIComponent(returnTo)}` as const)
    : ('/compare/discoverProducts' as const);

  useEffect(() => {
    const requested = (params?.pill ?? '').toString().trim();
    if (!requested) return;
    const match = pills.find((p) => p.toLowerCase() === requested.toLowerCase());
    if (match) {
      setActivePill(match);
      scrollPillIntoView(match);
    }
  }, [params?.pill]);

  const allSections = useMemo(
    () => [
      { key: 'recommended', title: 'Recommended', data: recommendedProducts },
      { key: 'trending', title: 'Trending', data: trendingProducts },
      { key: 'mens', title: 'Mens', data: mensProducts },
      { key: 'womens', title: 'Womens', data: womensProducts },
      { key: 'fashion', title: 'Fashion', data: fashionProducts },
      { key: 'tech', title: 'Tech', data: techProducts },
      { key: 'home', title: 'Home', data: homeProducts },
      { key: 'health', title: 'Health', data: healthProducts },
      { key: 'sports', title: 'Sports', data: sportsProducts },
      { key: 'gifts', title: 'Gifts', data: giftsProducts },
    ],
    []
  );

  const pillGridData = useMemo(() => {
    if (activePill === 'Recommended') return recommendedProducts;
    if (activePill === 'Trending') return trendingProducts;
    if (activePill === 'Mens') return mensProducts;
    if (activePill === 'Womens') return womensProducts;
    if (activePill === 'Fashion') return fashionProducts;
    if (activePill === 'Tech') return techProducts;
    if (activePill === 'Home') return homeProducts;
    if (activePill === 'Health') return healthProducts;
    if (activePill === 'Sports') return sportsProducts;
    if (activePill === 'Gifts') return giftsProducts;
    return recommendedProducts;
  }, [activePill]);

  const pillSubheader = useMemo(() => {
    if (activePill === 'Mens') return "Men's";
    if (activePill === 'Womens') return "Women's";
    return activePill;
  }, [activePill]);

  const renderDealsGridTile = ({ item }: { item: Product }) => {
    return (
      <View style={styles.dealsTile}>
        <View style={styles.dealsImageWrap}>
          <Image source={{ uri: item.image }} style={styles.dealsImage} />
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.dealsHeartBtn, liked[item.id] ? styles.dealsHeartBtnActive : null]}
            onPress={() => setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
          >
            <Ionicons name={liked[item.id] ? 'heart' : 'heart-outline'} size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.dealsMetaRow}>
          <View style={styles.dealsBrandCircle}>
            <Text style={styles.dealsBrandCircleText}>{getInitial(item.store)}</Text>
          </View>

          <View style={styles.dealsMetaTextWrap}>
            <Text numberOfLines={1} style={styles.dealsMetaBrand}>
              {item.store}
            </Text>
            <Text numberOfLines={1} style={styles.dealsMetaProduct}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.dealsMetaCategory}>
              {activePill}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
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
        <View style={styles.productLogoCircle}>
          <Text style={styles.productLogoText}>{getInitial(item.store)}</Text>
        </View>
        <View style={styles.productTextCol}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productStore} numberOfLines={1}>
            {item.store}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              const rt = (params.returnTo ?? '').toString().trim();
              if (rt) {
                router.replace(rt as Href);
                return;
              }
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)/compare' as Href);
            }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Discover Products</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <TouchableOpacity style={styles.searchContainer} onPress={() => router.push('/search' as Href)}>
          <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Products"
            placeholderTextColor="#6B7280"
            editable={false}
            pointerEvents="none"
          />
          <TouchableOpacity style={styles.searchCameraButton} onPress={() => router.push('/(tabs)/camera' as Href)}>
            <Ionicons name="camera-outline" size={20} color={BRAND_GREEN} />
          </TouchableOpacity>
        </TouchableOpacity>

        <ScrollView ref={navRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navContainer}>
          {pills.map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.navItem, activePill === label && styles.activeNavItem]}
              onLayout={(e: LayoutChangeEvent) => {
                pillX.current[label] = e.nativeEvent.layout.x;
              }}
              onPress={() => {
                setActivePill(label);
                scrollPillIntoView(label);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.navText, activePill === label && styles.activeNavText]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activePill === 'All' ? (
          <>
            {allSections.map((sec) => (
              <View key={sec.key} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleNoPad}>{sec.title}</Text>
                </View>
                <FlatList
                  data={sec.data}
                  renderItem={renderProductCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productsContainer}
                />
              </View>
            ))}
          </>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleNoPad}>{pillSubheader}</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.iconOnlyBtn}
                onPress={() => router.push(`/filter?returnTo=${encodeURIComponent(selfHref)}` as unknown as Href)}
              >
                <FilterGlyph />
              </TouchableOpacity>
            </View>
            <FlatList
              data={pillGridData}
              renderItem={({ item }) => <View style={styles.gridCell}>{renderDealsGridTile({ item } as any)}</View>}
              keyExtractor={(item, idx) => `${item.id ?? idx}`}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContainer}
            />
          </View>
        )}

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightSpacer: {
    width: 36,
    height: 36,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
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
    fontFamily: 'Manrope-Regular',
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
    backgroundColor: '#111827',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  activeNavText: {
    color: '#FFFFFF',
  },

  section: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitleNoPad: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  iconOnlyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  productsContainer: {
    paddingLeft: 20,
    paddingRight: 6,
  },

  productCard: {
    width: 150,
    marginRight: 14,
    marginBottom: 12,
  },
  gridContainer: {
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 6,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCell: {
    width: (width - 48) / 2,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
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
  heartIconActive: {
    backgroundColor: BRAND_GREEN,
  },
  productMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  productLogoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productLogoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  productTextCol: {
    flex: 1,
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

  dealsTile: {
    width: '100%',
    marginBottom: 22,
  },
  dealsImageWrap: {
    width: '100%',
    height: 162,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  dealsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dealsHeartBtn: {
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
  dealsHeartBtnActive: {
    backgroundColor: BRAND_GREEN,
  },
  dealsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  dealsBrandCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealsBrandCircleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  dealsMetaTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  dealsMetaBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.15,
    fontFamily: 'Manrope-Regular',
  },
  dealsMetaProduct: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.15,
    fontFamily: 'Manrope-Regular',
  },
  dealsMetaCategory: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: -0.15,
    fontFamily: 'Manrope-Regular',
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
});
