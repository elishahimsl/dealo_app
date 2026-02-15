import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Dealo logo font family - using system font that matches the logo's clean sans-serif style
const DEALO_FONT_FAMILY = 'Manrope-Regular'; // This matches the clean, modern sans-serif of the Dealo logo
const BRAND_GREEN = '#0E9F6E';

type RangeKey = '90D' | '3M' | '1Y';

interface DetectedProduct {
  objectName: string;
  category: string;
  confidence: string;
  description: string;
  features: string;
  priceRange: string;
  alternatives: string;
  imageUri: string;
}

// Product data with extended properties
interface ExtendedProductData {
  specs?: Record<string, any>;
  reviews?: {
    average: number;
    total: number;
    sentiment: number;
    summary: string;
    common: string;
    pros: string[];
    cons: string[];
  };
  retailers?: Record<string, {
    price: number;
    stock: boolean;
    rating: number;
    shipping: string;
  }>;
  alternatives?: {
    name: string;
    price: number;
    rating: number;
    image: string;
  }[];
  currentPrice?: number;
}

const MOCK_CAMERA_RESULTS = {
  product: {
    name: 'Beats Solo 4',
    subtitle: 'Beats Solo 4 - Black',
    dealPill: 'Good Deal',
    matchDots: 4,
    image:
      'https://images.unsplash.com/photo-1518441902117-f0a6a8efb6f3?auto=format&fit=crop&w=1200&q=80',
  },
  overview: {
    description:
      'The Beats Solo 4 are on-ear wireless headphones designed for everyday listening with strong bass',
    tags: ['Wireless Headphones', '40 Hr Battery', 'On Ear-comfort', 'Built in Mic'],
    strengths: [
      'Sleek and modern aesthetics that fit well with everyday wear',
      'Strong bass response — satisfying for pop, hip-hop',
      'Adjustable headband and foldable design improve portability',
    ],
    weaknesses: [
      "On-ear design doesn't provide as tight a seal as over-ear models",
      'Premium pricing compared with similar feature sets from competitors',
      'Bass-forward tuning can overshadow mids and highs for some',
    ],
  },
  aiScore: {
    score: 85,
    label: 'Strong Deal',
    breakdown: [
      { key: 'Price', value: 78 },
      { key: 'Features', value: 80 },
      { key: 'Value', value: 82 },
      { key: 'Durability', value: 82 },
    ],
    rundown:
      'The 83 score reflects strong popularity, reliable performance, and positive reviews, balanced against higher pricing and the lack of premium noise cancellation.',
  },
  bestPrice: {
    discount: '25% Off',
    store: 'Target',
    rating: 4.2,
    price: '$149.99',
    stock: 'In-Stock',
  },
  market: {
    avg: '$199.99',
    today: '$149.99',
    low: '$79.99',
    range: ['30D', '90D', '1Y'] as const,
    points: [210, 210, 180, 185, 175, 170, 200, 200, 150],
  },
  reviews: {
    overall: 'Positive',
    rows: [
      { k: 'Overall Sentiment', v: 'Positive', tone: 'good' as const },
      { k: 'Battery Life', v: 'Fair', tone: 'warn' as const },
      { k: 'Comfort', v: 'Very Positive', tone: 'good' as const },
      { k: 'Sound', v: 'Positive', tone: 'good' as const },
      { k: 'Build Quality', v: 'Positive', tone: 'good' as const },
    ],
  },
  reviewOverview: {
    sentiment: 'Mostly Positive',
    body:
      'Across public reviews, the Beats Solo 4 are consistently praised for their comfortable on-ear fit, long battery life, and reliable everyday performance.',
  },
  otherStores: [
    { id: 'os1', save: 'Save $70', store: 'Best Buy', name: 'Beats Solo 4-Black', price: '$129.99', logo: 'bestbuy' as const },
    { id: 'os2', save: 'Save $70', store: 'Beats', name: 'Beats Solo 4', price: '$199.99', logo: 'beats' as const },
  ],
  alternatives: [
    { id: 'alt1', save: 'Save $78', store: 'Best Buy', name: 'Sony - WHCH720N', price: '$99.99', logo: 'bestbuy' as const },
    { id: 'alt2', save: 'Save $180', store: 'Walmart', name: 'Sony - WHCH720N', price: '$169.95', logo: 'walmart' as const },
  ],
} as const;

const MOCK_MARKET_MAX = Math.max(...MOCK_CAMERA_RESULTS.market.points);
const MOCK_MARKET_MIN = Math.min(...MOCK_CAMERA_RESULTS.market.points);
const MOCK_MARKET_MID = Math.round((MOCK_MARKET_MAX + MOCK_MARKET_MIN) / 2);

type StoreLogoKey = 'target' | 'bestbuy' | 'beats' | 'walmart';

function StoreLogo({ kind }: { kind: StoreLogoKey }) {
  if (kind === 'target') {
    return (
      <View style={[styles.storeLogoCircle, { backgroundColor: '#E11D48' }]}>
        <View style={styles.targetRingOuter}>
          <View style={styles.targetRingInner} />
        </View>
      </View>
    );
  }

  if (kind === 'beats') {
    return (
      <View style={[styles.storeLogoCircle, { backgroundColor: '#DC2626' }]}>
        <Text style={styles.storeLogoText}>b</Text>
      </View>
    );
  }

  if (kind === 'bestbuy') {
    return (
      <View style={[styles.storeLogoCircle, { backgroundColor: '#FBBF24' }]}>
        <Text style={[styles.storeLogoText, { color: '#111827' }]}>BB</Text>
      </View>
    );
  }

  return (
    <View style={[styles.storeLogoCircle, { backgroundColor: '#F59E0B' }]}>
      <Text style={[styles.storeLogoText, { color: '#111827' }]}>✳</Text>
    </View>
  );
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.25 && value - full < 0.75;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <View style={styles.starRow}>
      {Array.from({ length: full }).map((_, i) => (
        <Ionicons key={`f${i}`} name="star" size={14} color="#111827" style={styles.starIcon} />
      ))}
      {half && <Ionicons name="star-half" size={14} color="#111827" style={styles.starIcon} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Ionicons key={`e${i}`} name="star-outline" size={14} color="#9CA3AF" style={styles.starIcon} />
      ))}
    </View>
  );
}

function MarketChart({ points }: { points: number[] }) {
  const w = 170;
  const h = 104;
  const pad = 10;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(1, max - min);

  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1));
  const ys = points.map((p) => pad + ((max - p) * (h - pad * 2)) / span);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ');
  const area = `${d} L ${(pad + (w - pad * 2)).toFixed(1)} ${(h - pad).toFixed(1)} L ${pad.toFixed(1)} ${(h - pad).toFixed(1)} Z`;

  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BRAND_GREEN} stopOpacity="0.35" />
          <Stop offset="1" stopColor={BRAND_GREEN} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Path d={area} fill="url(#g)" />
      <Path d={d} stroke={BRAND_GREEN} strokeWidth={3} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// Enhanced realistic product database
const REAL_PRODUCT_DATABASE = {
  'Apple iPhone 15 Pro': {
    category: 'Electronics',
    specs: {
      display: '6.1\" Super Retina XDR',
      processor: 'A17 Pro chip',
      camera: '48MP Main, 12MP Ultra Wide',
      battery: 'Up to 29 hours video playback',
      storage: '128GB, 256GB, 512GB, 1TB',
      dimensions: '5.81 x 2.82 x 0.32 inches',
      weight: '221 grams'
    },
    priceHistory: [1199, 1099, 999, 949, 899],
    currentPrice: 949,
    priceRange: '$899-$1199',
    reviews: {
      average: 4.6,
      total: 15432,
      sentiment: 0.84,
      summary: 'Users praise the camera system and A17 performance. Battery life significantly improved from previous models.',
      common: 'Battery life improvement and camera quality most mentioned',
      pros: ['Excellent camera system', 'Fast A17 performance', 'Bright Super Retina display'],
      cons: ['High price point', 'Limited charging speed vs competitors']
    },
    retailers: {
      'Apple Store': { price: 999, stock: true, rating: 4.8, shipping: 'Free shipping' },
      'Amazon': { price: 949, stock: true, rating: 4.5, shipping: 'Free shipping' },
      'Best Buy': { price: 999, stock: true, rating: 4.4, shipping: '$5.99 shipping' },
      'Target': { price: 979, stock: true, rating: 4.3, shipping: 'Free shipping' }
    },
    alternatives: [
      { name: 'Samsung Galaxy S24', price: 799, rating: 4.3, image: 'https://images.unsplash.com/photo-1610945412018-78e5d418742?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Google Pixel 8 Pro', price: 899, rating: 4.4, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80' },
      { name: 'OnePlus 12', price: 699, rating: 4.2, image: 'https://images.unsplash.com/photo-1601784559577-72cfa9958b9?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  'Nike Air Max 90': {
    category: 'Footwear',
    specs: {
      upper: 'Leather, mesh, and synthetic materials',
      sole: 'Rubber Waffle outsole',
      cushioning: 'Visible Air-Sole unit',
      weight: '13.4 ounces',
      sizes: 'US 7-13, UK 6-12, EU 40-46'
    },
    priceHistory: [150, 139, 129, 119, 109],
    currentPrice: 119,
    priceRange: '$109-$150',
    reviews: {
      average: 4.3,
      total: 8932,
      sentiment: 0.79,
      summary: 'Classic comfort and style. Users love the retro look but some mention durability concerns with regular wear.',
      common: 'Comfort and style most praised',
      pros: ['Classic design', 'Good cushioning', 'Versatile styling'],
      cons: ['Durability issues', 'Sizing inconsistencies']
    },
    retailers: {
      'Nike': { price: 150, stock: true, rating: 4.6, shipping: 'Free shipping' },
      'Foot Locker': { price: 139, stock: true, rating: 4.4, shipping: '$6.99 shipping' },
      'Finish Line': { price: 129, stock: true, rating: 4.2, shipping: 'Free shipping' }
    },
    alternatives: [
      { name: 'Adidas UltraBoost', price: 139, rating: 4.2, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80' },
      { name: 'New Balance 574', price: 89, rating: 4.1, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Jordan 1 Retro', price: 119, rating: 4.5, image: 'https://images.unsplash.com/photo-1542291026-f7367b8c5c5?auto=format&fit=crop&w=1200&q=80' }
    ]
  },
  'Keurig K-Classic Coffee Maker': {
    category: 'Appliances',
    specs: {
      capacity: '48 oz removable water reservoir',
      brewing: 'Single-serve brewing system',
      compatibility: 'K-Cup pods (over 400 varieties)',
      dimensions: '13.3 x 9.8 x 13.8 inches',
      weight: '7.6 lbs'
    },
    priceHistory: [89, 79, 69, 59, 49],
    currentPrice: 59,
    priceRange: '$49-$89',
    reviews: {
      average: 4.1,
      total: 12453,
      sentiment: 0.76,
      summary: 'Convenient and reliable for daily coffee. Users appreciate the speed and variety of K-Cups, though some mention environmental concerns.',
      common: 'Convenience and speed most mentioned',
      pros: ['Fast brewing', 'Easy to use', 'Wide variety of flavors'],
      cons: ['Environmental waste', 'Limited to K-Cup ecosystem']
    },
    retailers: {
      'Amazon': { price: 59, stock: true, rating: 4.2, shipping: 'Free shipping' },
      'Target': { price: 69, stock: true, rating: 4.0, shipping: 'Free shipping' },
      'Walmart': { price: 49, stock: true, rating: 3.9, shipping: 'Free shipping' },
      'Bed Bath & Beyond': { price: 79, stock: true, rating: 4.1, shipping: '$4.99 shipping' }
    },
    alternatives: [
      { name: 'Cuisinart DCC-1200', price: 79, rating: 4.2, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Nespresso VertuoPlus', price: 129, rating: 4.3, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Breville Bambino', price: 99, rating: 4.4, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80' }
    ]
  }
};

// Smart product matching function
const buildFallbackProductData = (category: string) => {
  const safeCategory = (category || 'General').trim() || 'General';
  return {
    category: safeCategory,
    specs: {
      display: 'High quality display',
      processor: 'Fast processor',
      camera: 'Quality camera system',
      battery: 'Long lasting battery',
      storage: 'Multiple storage options',
    },
    priceHistory: [299, 249, 199, 149],
    currentPrice: 199,
    priceRange: '$149-$299',
    reviews: {
      average: 4.2,
      total: Math.floor(Math.random() * 10000) + 5000,
      sentiment: 0.78,
      summary: `Quality ${safeCategory.toLowerCase()} with good user reviews and reliable performance.`,
      common: 'Users appreciate the quality and value',
      pros: ['Good quality', 'Reliable performance', 'Great value'],
      cons: ['Limited availability', 'Generic brand'],
    },
    retailers: {
      'Amazon': { price: 199, stock: true, rating: 4.1, shipping: 'Free shipping' },
      'Best Buy': { price: 229, stock: true, rating: 4.0, shipping: '$4.99 shipping' },
      'Target': { price: 179, stock: true, rating: 3.9, shipping: 'Free shipping' },
    },
    alternatives: [
      { name: 'Premium Alternative', price: 179, rating: 4.0, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Budget Option', price: 149, rating: 3.8, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80' },
    ],
  };
};

const findProductInDatabase = (detectedName: string) => {
  const name = (detectedName || '').trim().toLowerCase();
  if (!name) return null;

  const searchTerms = name.split(' ').filter(Boolean);

  for (const [key, product] of Object.entries(REAL_PRODUCT_DATABASE)) {
    const productName = key.toLowerCase();

    if (
      productName.includes(name) ||
      name.includes(productName) ||
      searchTerms.some((term) => productName.includes(term))
    ) {
      return product;
    }
  }

  return null;
};

export default function CameraResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const identifyOnly = params.identifyOnly === '1';
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [aiSummaryExpanded, setAiSummaryExpanded] = useState(false);
  const [range, setRange] = useState<RangeKey>('90D');
  const half = useMemo(() => (width - 16 * 2 - 12) / 2, []);

      // Parse detected object data and find in realistic database
  const detectedProduct = useMemo(() => {
    const objectName = typeof params.objectName === 'string' ? params.objectName : '';
    const category = typeof params.category === 'string' ? params.category : 'General';

    const matched = findProductInDatabase(objectName);
    const realProduct = matched ?? buildFallbackProductData(category);

    const rawName = objectName.trim();
    const isBarcodeOnly = !!rawName && /^[0-9]{8,14}$/.test(rawName);
    const displayName = matched
      ? rawName || 'Unknown Product'
      : rawName && rawName.toLowerCase() !== 'unknown product' && !isBarcodeOnly
        ? rawName
        : 'Sample Product';

    return {
      objectName: displayName,
      category: realProduct.category || category || 'General',
      confidence: (params.confidence as string) || '0.85',
      description: realProduct.reviews?.summary || 'Product detected but not identified',
      features: realProduct.specs ? JSON.stringify(Object.values(realProduct.specs)) : JSON.stringify(['Feature 1', 'Feature 2']),
      priceRange: realProduct.priceRange || '$50-$100',
      alternatives: JSON.stringify(realProduct.alternatives?.map((alt: any) => alt.name) || ['Alternative 1', 'Alternative 2']),
      imageUri: (params.imageUri as string) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    };
  }, [params]);

  // Get extended product data for internal use
  const extendedProductData = useMemo(() => {
    const objectName = typeof params.objectName === 'string' ? params.objectName : '';
    const category = typeof params.category === 'string' ? params.category : 'General';
    return findProductInDatabase(objectName) ?? buildFallbackProductData(category);
  }, [params]);

  // Generate dynamic data based on realistic product
  const stores = useMemo(() => {
    if (extendedProductData.retailers) {
      return Object.entries(extendedProductData.retailers).map(([store, data], index) => ({
        id: `s${index}`,
        store,
        name: detectedProduct.objectName,
        price: `$${data.price}`,
        ship: data.shipping || '$5 Ship',
        image: detectedProduct.imageUri,
        rating: data.rating,
        stock: data.stock
      }));
    }
    return [];
  }, [extendedProductData]);
  
  const alternatives = useMemo(() => {
    if (extendedProductData.alternatives) {
      return extendedProductData.alternatives.map((alt: any, index: number) => ({
        ...alt,
        id: `a${index}`,
        store: 'Various',
        reviews: `(${Math.floor(Math.random() * 20 + 10)}k)`
      }));
    }
    return [];
  }, [extendedProductData]);
  
  const dealRows = useMemo(() => {
    if (extendedProductData.reviews) {
      const baseScore = Math.round(extendedProductData.reviews.sentiment * 100);
      return [
        { id: 'q', label: 'Quality', value: baseScore, pill: baseScore > 85 ? 'Excellent' : baseScore > 70 ? 'Good' : 'Fair' },
        { id: 'v', label: 'Value', value: baseScore - 10, pill: baseScore > 85 ? 'Great Deal' : baseScore > 70 ? 'Fair' : 'Poor' },
        { id: 'f', label: 'Features', value: baseScore - 5, pill: baseScore > 80 ? 'Rich' : 'Basic' },
        { id: 'd', label: 'Design', value: baseScore + 5, pill: baseScore > 85 ? 'Stunning' : 'Average' },
        { id: 'du', label: 'Durability', value: baseScore - 8, pill: baseScore > 80 ? 'Built to Last' : 'Standard' },
      ];
    }
    return [];
  }, [extendedProductData.reviews]);
  
  const features = useMemo(() => {
    if (extendedProductData.specs) {
      return Object.values(extendedProductData.specs);
    }
    return ['Feature 1', 'Feature 2'];
  }, [extendedProductData.specs]);

  if (identifyOnly) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={styles.headerBtn} />
          </View>

          <View style={styles.heroRow}>
            <View style={styles.heroCard}>
              <Image source={{ uri: detectedProduct.imageUri }} style={styles.heroImage} />
              <View style={styles.heroFade} />
              <Text style={styles.heroCardText}>{detectedProduct.objectName}</Text>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroBrand}>{detectedProduct.category}</Text>
              <Text style={styles.heroTitle}>{detectedProduct.objectName}</Text>
              <Text style={styles.heroCategory}>AI Confidence: {Math.round(parseFloat(detectedProduct.confidence || '0.7') * 100)}%</Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={() => router.replace('/(tabs)/camera')}>
              <Text style={styles.primaryText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.page}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRowMock}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="ellipsis-vertical" size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.topHeroRow}>
            <View style={styles.heroImageWrapMock}>
              <Image source={{ uri: MOCK_CAMERA_RESULTS.product.image }} style={styles.heroImageMock} />
            </View>
            <View style={styles.heroRight}>
              <Text style={styles.heroTitleMock}>{MOCK_CAMERA_RESULTS.product.name}</Text>
              <View style={styles.goodDealPill}>
                <Text style={styles.goodDealText}>{MOCK_CAMERA_RESULTS.product.dealPill}</Text>
              </View>

              <Text style={styles.productMatchLabel}>Product Match</Text>
              <View style={styles.matchDotsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View key={i} style={[styles.matchDot, i < MOCK_CAMERA_RESULTS.product.matchDots ? styles.matchDotOn : styles.matchDotOff]} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.hrMock} />

          <Text style={styles.sectionTitleMock}>Product Overview</Text>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewText}>{MOCK_CAMERA_RESULTS.overview.description}</Text>
            <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} style={{ marginTop: 2 }} />
          </View>
          <View style={styles.overviewTagsRow}>
            <Text style={styles.overviewTagsText}>{MOCK_CAMERA_RESULTS.overview.tags.join('   •   ')}</Text>
          </View>

          <View style={styles.strengthCard}>
            <View pointerEvents="none" style={styles.strengthTint} />
            <Text style={styles.cardHeader}>Strengths</Text>
            <View style={styles.bulletList}>
              {MOCK_CAMERA_RESULTS.overview.strengths.map((t, i) => (
                <View key={i} style={styles.bulletRowMock}>
                  <View style={[styles.bulletDotMock, { backgroundColor: BRAND_GREEN }]} />
                  <Text style={styles.bulletTextMock}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.weakCardWrap}>
            <View pointerEvents="none" style={styles.weakUnderlay} />
            <View style={styles.weakCard}>
              <View pointerEvents="none" style={styles.weakTint} />
              <Text style={styles.cardHeader}>Weaknesses</Text>
              <View style={styles.bulletList}>
                {MOCK_CAMERA_RESULTS.overview.weaknesses.map((t, i) => (
                  <View key={i} style={styles.bulletRowMock}>
                    <View style={[styles.bulletDotMock, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.bulletTextMock}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitleMock}>Deal Overview</Text>
          <View style={styles.aiScoreWrap}>
            <Text style={styles.aiScoreTitle}>
              AI Score <Text style={styles.aiScoreValue}>{MOCK_CAMERA_RESULTS.aiScore.score}</Text> {MOCK_CAMERA_RESULTS.aiScore.label}
            </Text>
            <View style={styles.aiTrack}>
              <View style={[styles.aiFill, { width: `${MOCK_CAMERA_RESULTS.aiScore.score}%` }]} />
            </View>
            <View style={styles.aiBreakRow}>
              {MOCK_CAMERA_RESULTS.aiScore.breakdown.map((b) => (
                <View key={b.key} style={styles.aiBreakItem}>
                  <View style={styles.aiDot} />
                  <Text style={styles.aiBreakText}>
                    {b.key} <Text style={styles.aiBreakNum}>{b.value}</Text>
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.aiRundownTitle}>AI Rundown</Text>
            <View style={styles.aiRundownRow}>
              <Text style={styles.aiRundownText}>{MOCK_CAMERA_RESULTS.aiScore.rundown}</Text>
              <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} />
            </View>
          </View>

          <View style={styles.bestPriceGlass}>
            <View style={styles.bestPriceHeaderRow}>
              <Text style={styles.bestPriceTitle}>Best Price</Text>
              <Ionicons name="bookmark-outline" size={20} color="#111827" />
            </View>
            <View style={styles.bestPriceBody}>
              <View style={styles.bestPriceThumbWrap}>
                <Image source={{ uri: MOCK_CAMERA_RESULTS.product.image }} style={styles.bestPriceThumb} />
                <View style={styles.discountPill}>
                  <Text style={styles.discountText}>{MOCK_CAMERA_RESULTS.bestPrice.discount}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.bestStoreRow}>
                  <StoreLogo kind="target" />
                  <Text style={styles.bestStoreName}>{MOCK_CAMERA_RESULTS.bestPrice.store}</Text>
                </View>
                <Text style={styles.bestSubtitle}>{MOCK_CAMERA_RESULTS.product.subtitle}</Text>
                <View style={styles.bestRatingRow}>
                  <StarRating value={MOCK_CAMERA_RESULTS.bestPrice.rating} />
                  <Text style={styles.bestRatingValue}>{MOCK_CAMERA_RESULTS.bestPrice.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.bestPriceValue}>{MOCK_CAMERA_RESULTS.bestPrice.price}</Text>
                <Text style={styles.bestStock}>{MOCK_CAMERA_RESULTS.bestPrice.stock}</Text>
                <TouchableOpacity activeOpacity={0.9} style={styles.visitBtnMock}>
                  <Text style={styles.visitTextMock}>Visit Store</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitleMock}>Market Price</Text>
          <View style={styles.marketRow}>
            <View style={styles.marketLeftCard}>
              <View style={styles.marketRangeRow}>
                {MOCK_CAMERA_RESULTS.market.range.map((r) => (
                  <View key={r} style={[styles.rangePillMock, r === '30D' && styles.rangePillActiveMock]}>
                    <Text style={[styles.rangePillTextMock, r === '30D' && styles.rangePillTextActiveMock]}>{r}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartWrapMock}>
                <View style={styles.chartWithYAxis}>
                  <View style={styles.chartYAxis}>
                    <Text style={styles.chartYAxisText}>{`$${MOCK_MARKET_MAX}`}</Text>
                    <Text style={styles.chartYAxisText}>{`$${MOCK_MARKET_MID}`}</Text>
                    <Text style={styles.chartYAxisText}>{`$${MOCK_MARKET_MIN}`}</Text>
                  </View>
                  <View style={styles.chartSvgWrap}>
                    <MarketChart points={[...MOCK_CAMERA_RESULTS.market.points]} />
                  </View>
                </View>
                <View style={styles.chartXRow}>
                  {['2', '12', '21', '31'].map((t) => (
                    <Text key={t} style={styles.chartAxisText}>{t}</Text>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.marketDivider} />
            <View style={styles.marketRightCard}>
              <Text style={styles.priceOverviewTitle}>Price Overview</Text>
              <View style={styles.priceOverviewRow}>
                <Text style={styles.priceOverviewLeft}>{MOCK_CAMERA_RESULTS.market.avg}</Text>
                <Text style={styles.priceOverviewRight}>Avg</Text>
              </View>
              <View style={styles.priceOverviewRow}>
                <Text style={styles.priceOverviewLeft}>{MOCK_CAMERA_RESULTS.market.today}</Text>
                <View style={styles.todayDot} />
                <Text style={styles.priceOverviewRight}>Today</Text>
              </View>
              <View style={styles.priceOverviewRow}>
                <Text style={styles.priceOverviewLeft}>{MOCK_CAMERA_RESULTS.market.low}</Text>
                <Text style={styles.priceOverviewRight}>Low</Text>
              </View>
            </View>
          </View>

          <View style={styles.reviewsGlass}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
            </View>
            {MOCK_CAMERA_RESULTS.reviews.rows.map((r, i) => (
              <View key={r.k} style={[styles.reviewRow, i !== MOCK_CAMERA_RESULTS.reviews.rows.length - 1 && styles.reviewRowBorder]}>
                <Text style={[styles.reviewKey, r.k === 'Overall Sentiment' && styles.reviewKeyBold]}>{r.k}</Text>
                <Text style={[styles.reviewVal, r.tone === 'warn' ? styles.reviewValWarn : styles.reviewValGood]}>{r.v}</Text>
              </View>
            ))}
          </View>

          <View style={styles.reviewOverviewSection}>
            <Text style={styles.reviewOverviewHeader}>Review Overview</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.reviewOverviewRow}>
              <Text style={styles.reviewOverviewTextInline}>{MOCK_CAMERA_RESULTS.reviewOverview.body}</Text>
              <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} style={styles.reviewOverviewChevron} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeaderRowMock}>
            <Text style={styles.sectionTitleMockNoTop}>Other Stores</Text>
            <Ionicons name="chevron-forward" size={18} color="#111827" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent} style={styles.hScroll}>
            {MOCK_CAMERA_RESULTS.otherStores.map((item) => (
              <View key={item.id} style={styles.hItem}>
                <View style={styles.gridCard}>
                  <View style={styles.gridImgPlaceholder} />
                  <View style={styles.savePill}>
                    <Text style={styles.savePillText}>{item.save}</Text>
                  </View>
                  <TouchableOpacity style={styles.heartBtn}>
                    <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.gridMetaRow}>
                  <View style={styles.storeLogoBlank} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gridStore}>{item.store}</Text>
                    <Text style={styles.gridName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.gridPrice}>{item.price}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.sectionHeaderRowMock}>
            <Text style={styles.sectionTitleMockNoTop}>Alternatives</Text>
            <Ionicons name="chevron-forward" size={18} color="#111827" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent} style={styles.hScroll}>
            {MOCK_CAMERA_RESULTS.alternatives.map((item) => (
              <View key={item.id} style={styles.hItem}>
                <View style={styles.gridCard}>
                  <View style={styles.gridImgPlaceholder} />
                  <View style={styles.savePill}>
                    <Text style={styles.savePillText}>{item.save}</Text>
                  </View>
                  <TouchableOpacity style={styles.heartBtn}>
                    <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.gridMetaRow}>
                  <View style={styles.storeLogoBlank} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gridStore}>{item.store}</Text>
                    <Text style={styles.gridName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.gridPrice}>{item.price}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.offRow}>
            <Text style={styles.offText}>Something seem off?</Text>
            <Text style={styles.offLink}> Let us know</Text>
          </View>

          <View style={styles.bottomActionsInFlow}>
            <TouchableOpacity activeOpacity={0.9} style={styles.bottomBtnSecondary}>
              <Text style={styles.bottomBtnSecondaryText}>Save for Later</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.bottomBtnPrimary}>
              <Text style={styles.bottomBtnPrimaryText}>View Offer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  page: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
  headerRow: { paddingHorizontal: 16, paddingTop: 6, flexDirection: 'row', alignItems: 'center' },
  headerBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  headerRowMock: { paddingHorizontal: 16, paddingTop: 10, flexDirection: 'row', alignItems: 'center' },
  topHeroRow: { paddingHorizontal: 16, marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 16 },
  glassTileHero: {
    flexDirection: 'row',
    borderRadius: 26,
    padding: 16,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 26,
    elevation: 10,
  },
  heroImageWrapMock: {
    width: 136,
    height: 136,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
    overflow: 'hidden',
  },
  heroImageMock: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroRight: { flex: 1, marginLeft: 0, justifyContent: 'center' },
  heroTitleMock: { fontSize: 26, fontWeight: '800', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  goodDealPill: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: '#D1FAE5', paddingHorizontal: 14, height: 30, borderRadius: 999, justifyContent: 'center' },
  goodDealText: { color: BRAND_GREEN, fontWeight: '600', fontSize: 13, fontFamily: DEALO_FONT_FAMILY },
  productMatchLabel: { marginTop: 12, fontSize: 13, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  matchDotsRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  matchDot: { width: 10, height: 10, borderRadius: 5 },
  matchDotOn: { backgroundColor: BRAND_GREEN },
  matchDotOff: { backgroundColor: '#6B7280' },

  hrMock: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 16, marginTop: 22 },
  sectionTitleMock: { paddingHorizontal: 16, marginTop: 24, fontSize: 16, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  sectionTitleMockNoTop: { fontSize: 16, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  overviewRow: { paddingHorizontal: 16, marginTop: 10, flexDirection: 'row', alignItems: 'flex-start' },
  overviewText: { flex: 1, fontSize: 13, lineHeight: 19, color: '#374151', fontWeight: '400', fontFamily: DEALO_FONT_FAMILY },
  overviewTagsRow: { paddingHorizontal: 16, marginTop: 10 },
  overviewTagsText: { fontSize: 11, fontWeight: '500', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },

  strengthCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 7,
    padding: 14,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.66)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  strengthTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,159,110,0.16)',
  },
  weakCardWrap: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingBottom: 6,
  },
  weakUnderlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
    borderRadius: 7,
    backgroundColor: 'transparent',
  },
  weakCard: {
    borderRadius: 7,
    padding: 14,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.66)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  weakTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245,158,11,0.28)',
  },
  cardHeader: { fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 10, fontFamily: 'Manrope-SemiBold' },
  bulletList: { gap: 10 },
  bulletRowMock: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bulletDotMock: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  bulletTextMock: { flex: 1, fontSize: 13, lineHeight: 18, color: '#111827', fontWeight: '400', fontFamily: DEALO_FONT_FAMILY },

  aiScoreWrap: { marginHorizontal: 16, marginTop: 16 },
  aiScoreTitle: { fontSize: 15, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  aiScoreValue: { color: BRAND_GREEN },
  aiTrack: { height: 8, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden', marginTop: 10 },
  aiFill: { height: '100%', backgroundColor: BRAND_GREEN, borderRadius: 999 },
  aiBreakRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  aiBreakItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: BRAND_GREEN },
  aiBreakText: { fontSize: 12, fontWeight: '500', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  aiBreakNum: { color: BRAND_GREEN, fontWeight: '600' },
  aiRundownTitle: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  aiRundownRow: { flexDirection: 'row', gap: 10, marginTop: 8, alignItems: 'flex-start' },
  aiRundownText: { flex: 1, fontSize: 13, lineHeight: 18, color: '#6B7280', fontWeight: '400', fontFamily: DEALO_FONT_FAMILY },

  bestPriceGlass: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 28,
    padding: 16,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 26,
    elevation: 10,
  },
  bestPriceHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  bestPriceTitle: { fontSize: 18, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestPriceBody: { flexDirection: 'row', gap: 14 },
  bestPriceThumbWrap: { width: 126, height: 126, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 7 },
  bestPriceThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  discountPill: { position: 'absolute', left: 12, top: 12, height: 26, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#D1FAE5', justifyContent: 'center' },
  discountText: { fontSize: 11, fontWeight: '600', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },
  bestStoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  bestStoreName: { fontSize: 14, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestSubtitle: { fontSize: 13, fontWeight: '400', color: '#374151', marginBottom: 6, fontFamily: DEALO_FONT_FAMILY },
  bestRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bestRatingValue: { fontSize: 13, fontWeight: '500', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestPriceValue: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 6, fontFamily: DEALO_FONT_FAMILY },
  bestStock: { fontSize: 13, fontWeight: '600', color: BRAND_GREEN, marginBottom: 10, fontFamily: DEALO_FONT_FAMILY },
  visitBtnMock: { alignSelf: 'flex-start', height: 36, borderRadius: 999, backgroundColor: BRAND_GREEN, paddingHorizontal: 16, justifyContent: 'center' },
  visitTextMock: { color: '#FFFFFF', fontWeight: '600', fontSize: 13, fontFamily: DEALO_FONT_FAMILY },

  storeLogoCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  storeLogoText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', fontFamily: DEALO_FONT_FAMILY, marginTop: -2 },
  targetRingOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  targetRingInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },

  starRow: { flexDirection: 'row', alignItems: 'center' },
  starIcon: { marginRight: 2 },

  marketRow: { flexDirection: 'row', gap: 0, paddingHorizontal: 16, marginTop: 12, alignItems: 'stretch' },
  marketLeftCard: { flex: 1.2, padding: 0, minHeight: 224 },
  marketDivider: { width: 1, backgroundColor: '#EEF2F7', marginHorizontal: 10, borderRadius: 1 },
  marketRightCard: { flex: 0.8, padding: 0, minHeight: 224 },
  marketRangeRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  rangePillMock: { height: 24, paddingHorizontal: 10, borderRadius: 6, justifyContent: 'center', backgroundColor: 'transparent' },
  rangePillActiveMock: { backgroundColor: '#E5E7EB' },
  rangePillTextMock: { fontSize: 11, fontWeight: '500', color: '#9CA3AF', fontFamily: DEALO_FONT_FAMILY },
  rangePillTextActiveMock: { color: '#111827' },
  chartWrapMock: { alignItems: 'stretch' },
  chartWithYAxis: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  chartYAxis: { height: 104, justifyContent: 'space-between', paddingVertical: 10, marginRight: 8 },
  chartYAxisText: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },
  chartSvgWrap: { width: 170, height: 104 },
  chartXRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 8, marginTop: 6 },
  chartAxisText: { fontSize: 10, color: '#9CA3AF', fontWeight: '500', fontFamily: DEALO_FONT_FAMILY },
  priceOverviewTitle: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 10, fontFamily: DEALO_FONT_FAMILY },
  priceOverviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  priceOverviewLeft: { fontSize: 13, fontWeight: '400', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  priceOverviewRight: { fontSize: 12, fontWeight: '500', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  todayDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: BRAND_GREEN, marginHorizontal: 8 },
  

  reviewsGlass: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 28,
    padding: 16,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 26,
    elevation: 10,
  },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewsTitle: { fontSize: 17, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  reviewRowBorder: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  reviewKey: { fontSize: 13, fontWeight: '400', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  reviewKeyBold: { fontWeight: '600' },
  reviewVal: { fontSize: 13, fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },
  reviewValGood: { color: BRAND_GREEN },
  reviewValWarn: { color: '#F59E0B' },

  reviewOverviewSection: { paddingHorizontal: 16, marginTop: 14 },
  reviewOverviewHeader: { fontSize: 15, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  reviewOverviewRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8 },
  reviewOverviewTextInline: { flex: 1, fontSize: 13, lineHeight: 19, color: '#6B7280', fontWeight: '400', fontFamily: DEALO_FONT_FAMILY },
  reviewOverviewChevron: { marginTop: 2 },

  sentimentRowMock: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
  sentimentLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  sentimentValue: { fontSize: 12, fontWeight: '600', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },
  reviewBody: { paddingHorizontal: 16, marginTop: 10, fontSize: 13, lineHeight: 19, color: '#111827', fontWeight: '400', fontFamily: DEALO_FONT_FAMILY },
  reviewCheckRow: { paddingHorizontal: 16, marginTop: 6, alignItems: 'flex-end' },

  sectionHeaderRowMock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 18, marginBottom: 10 },
  hScroll: { paddingHorizontal: 16 },
  hScrollContent: { gap: 14, paddingRight: 16 },
  hItem: { width: Math.min(180, Math.round(width * 0.46)) },
  gridCard: { borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEF2F7', padding: 12, overflow: 'hidden' },
  gridImgPlaceholder: { width: '100%', height: 120, borderRadius: 12, backgroundColor: '#F3F4F6' },
  savePill: { position: 'absolute', left: 12, top: 12, height: 22, borderRadius: 6, backgroundColor: BRAND_GREEN, paddingHorizontal: 10, justifyContent: 'center' },
  savePillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', fontFamily: DEALO_FONT_FAMILY },
  heartBtn: { position: 'absolute', right: 12, bottom: 12, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(17,24,39,0.55)', justifyContent: 'center', alignItems: 'center' },
  gridMetaRow: { marginTop: 10, flexDirection: 'row', gap: 10, alignItems: 'center' },
  gridStore: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  gridName: { fontSize: 12, fontWeight: '400', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  gridPrice: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  storeLogoBlank: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E5E7EB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },

  offRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  offText: { fontSize: 12, fontWeight: '600', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  offLink: { fontSize: 12, fontWeight: '600', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },

  bottomActionsInFlow: { paddingHorizontal: 16, marginTop: 18, marginBottom: 22, flexDirection: 'row', gap: 14 },
  bottomBtnSecondary: { flex: 1, height: 54, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  bottomBtnSecondaryText: { color: BRAND_GREEN, fontSize: 15, fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },
  bottomBtnPrimary: { flex: 1, height: 54, borderRadius: 999, backgroundColor: BRAND_GREEN, justifyContent: 'center', alignItems: 'center', shadowColor: BRAND_GREEN, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.33, shadowRadius: 26, elevation: 12 },
  bottomBtnPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },

  heroRow: { paddingHorizontal: 16, marginTop: 4, flexDirection: 'row', gap: 12 },
  heroCard: { width: 120, height: 136, borderRadius: 16, backgroundColor: '#fff', overflow: 'hidden', borderWidth: 1, borderColor: '#EEF2F7' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 58, backgroundColor: 'rgba(255,255,255,0.88)' },
  heroCardText: { position: 'absolute', left: 12, right: 12, bottom: 12, fontSize: 14, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  heroInfo: { flex: 1, paddingTop: 6 },
  heroBrand: { fontSize: 10, fontWeight: '700', color: '#6B7280', marginBottom: 3, fontFamily: DEALO_FONT_FAMILY },
  heroTitle: { fontSize: 14, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  heroCategory: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 6, fontFamily: DEALO_FONT_FAMILY },
  shareBtn: { height: 26, borderRadius: 999, backgroundColor: '#EEF2F7', paddingHorizontal: 12, justifyContent: 'center', alignSelf: 'flex-start' },
  shareText: { fontWeight: '800', color: '#111827', fontSize: 10, fontFamily: DEALO_FONT_FAMILY },

  sectionTitle: { paddingHorizontal: 16, marginTop: 12, marginBottom: 6, fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bodyText: { paddingHorizontal: 16, fontSize: 12, lineHeight: 18, color: '#374151', fontWeight: '500', fontFamily: DEALO_FONT_FAMILY },
  collapsibleSection: { marginHorizontal: 16, marginTop: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F7', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#F9FAFB' },
  sectionContent: { paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#fff' },
  bulletsRow: { paddingHorizontal: 16, marginTop: 10, flexDirection: 'row', gap: 14 },
  bulletItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND_GREEN, marginTop: 6 },
  bulletText: { flex: 1, fontSize: 11, color: '#111827', fontWeight: '600', lineHeight: 16, fontFamily: DEALO_FONT_FAMILY },

  card: { marginTop: 14, marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#EEF2F7', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 4 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 8, fontFamily: DEALO_FONT_FAMILY },
  muted: { fontSize: 12, lineHeight: 18, color: '#6B7280', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },
  smallMuted: { fontSize: 10, fontWeight: '600', color: '#6B7280', marginBottom: 2, fontFamily: DEALO_FONT_FAMILY },
  hr: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },

  scoreCircle: { width: 88, alignItems: 'center' },
  scoreRing: { width: 74, height: 74, borderRadius: 37, borderWidth: 8, borderColor: BRAND_GREEN, borderRightColor: '#E5E7EB' },
  scoreNum: { position: 'absolute', top: 16, fontSize: 24, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  scoreOut: { position: 'absolute', top: 46, fontSize: 10, fontWeight: '800', color: '#9CA3AF', fontFamily: DEALO_FONT_FAMILY },
  scoreVerdict: { marginTop: 8, fontSize: 11, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  dealRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dealLabel: { width: 68, fontSize: 11, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  dealTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden', marginHorizontal: 8 },
  dealFill: { height: '100%', backgroundColor: BRAND_GREEN, borderRadius: 999 },
  dealNum: { width: 28, textAlign: 'right', fontSize: 11, fontWeight: '900', color: '#111827', marginRight: 8, fontFamily: DEALO_FONT_FAMILY },
  dealPill: { height: 24, borderRadius: 999, backgroundColor: '#D1FAE5', paddingHorizontal: 10, justifyContent: 'center', marginRight: 8 },
  dealPillText: { fontSize: 9, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },

  twoCol: { flexDirection: 'row', gap: 12 },
  smallCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#EEF2F7', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 14, elevation: 4 },
  smallTitle: { fontSize: 14, fontWeight: '900', color: '#111827', marginBottom: 6, fontFamily: DEALO_FONT_FAMILY },
  rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  rangeTab: { paddingHorizontal: 8, height: 24, borderRadius: 999, justifyContent: 'center' },
  rangeTabActive: { backgroundColor: '#E5E7EB' },
  rangeText: { fontSize: 10, fontWeight: '800', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  rangeTextActive: { color: BRAND_GREEN },
  chartBox: { height: 112, borderRadius: 12, overflow: 'hidden', marginBottom: 10, backgroundColor: '#fff' },
  grid: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#E5E7EB' },
  chartStroke: { position: 'absolute', left: 8, top: 58, width: 104, height: 3, backgroundColor: BRAND_GREEN, borderRadius: 2, transform: [{ rotate: '-10deg' }] },
  chartFillBox: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(14,159,110,0.10)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCol: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 13, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#6B7280', marginTop: 3, fontFamily: DEALO_FONT_FAMILY },
  goodPill: { height: 36, borderRadius: 999, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' },
  goodText: { fontSize: 11, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },
  bestHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  thumb: { width: 52, height: 52, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bestName: { fontSize: 13, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  bestPrice: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  bestPills: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  bestPill: { height: 24, borderRadius: 999, backgroundColor: '#D1FAE5', paddingHorizontal: 10, justifyContent: 'center' },
  bestPillText: { fontSize: 11, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },
  inStock: { fontSize: 12, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },
  visitBtn: { height: 36, borderRadius: 999, backgroundColor: BRAND_GREEN, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  visitText: { fontSize: 13, fontWeight: '900', color: '#fff', fontFamily: DEALO_FONT_FAMILY },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: '900', color: '#111827', marginRight: 6, fontFamily: DEALO_FONT_FAMILY },
  ratingMuted: { fontSize: 11, fontWeight: '700', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },

  storeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEF2F7' },
  storeThumb: { width: 56, height: 56, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6', marginRight: 12 },
  storeThumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  storeTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  storeName: { fontSize: 14, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  shipText: { fontSize: 11, fontWeight: '700', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  storeProd: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  storePrice: { fontSize: 18, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  outlineBtn: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  outlineText: { fontSize: 14, fontWeight: '800', color: '#111827', fontFamily: DEALO_FONT_FAMILY },

  reviewBox: { marginTop: 12, marginHorizontal: 16, borderRadius: 14, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#BBF7D0', padding: 12 },
  reviewTag: { alignSelf: 'flex-start', backgroundColor: BRAND_GREEN, paddingHorizontal: 12, height: 26, borderRadius: 8, justifyContent: 'center', marginBottom: 10 },
  reviewTagText: { color: '#fff', fontWeight: '900', fontSize: 12, fontFamily: DEALO_FONT_FAMILY },
  reviewLine: { fontSize: 14, color: '#111827', fontWeight: '600', lineHeight: 20, fontFamily: DEALO_FONT_FAMILY },
  trustHeader: { paddingHorizontal: 16, marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trustTitle: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  confidence: { paddingHorizontal: 16, marginTop: 8, fontSize: 16, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },
  trustTrack: { height: 8, borderRadius: 999, backgroundColor: '#E5E7EB', marginHorizontal: 16, marginTop: 8, overflow: 'hidden' },
  trustFill: { width: '72%', height: '100%', backgroundColor: BRAND_GREEN, borderRadius: 999 },
  sentiments: { paddingHorizontal: 16, marginTop: 12, gap: 10 },
  sentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sentLabel: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  sentPill: { height: 28, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
  sentText: { fontSize: 12, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },

  altRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  altThumb: { width: 68, height: 68, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  altThumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  altName: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  altPrice: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  tagPill: { height: 28, borderRadius: 8, backgroundColor: '#D1FAE5', paddingHorizontal: 12, justifyContent: 'center' },
  tagText: { fontSize: 12, fontWeight: '900', color: BRAND_GREEN, fontFamily: DEALO_FONT_FAMILY },

  bottomRow: { paddingHorizontal: 16, marginTop: 18, flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, height: 52, borderRadius: 999, backgroundColor: BRAND_GREEN, justifyContent: 'center', alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '900', fontFamily: DEALO_FONT_FAMILY },
  secondaryBtn: { flex: 1, height: 52, borderRadius: 999, borderWidth: 3, borderColor: BRAND_GREEN, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  secondaryText: { color: BRAND_GREEN, fontSize: 16, fontWeight: '900', fontFamily: DEALO_FONT_FAMILY },
});
