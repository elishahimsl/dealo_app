import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// Dealo logo font family - using system font that matches the logo's clean sans-serif style
const DEALO_FONT_FAMILY = 'System'; // This matches the clean, modern sans-serif of the Dealo logo

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
const findProductInDatabase = (detectedName: string, category: string) => {
  const searchTerms = detectedName.toLowerCase().split(' ');
  
  for (const [key, product] of Object.entries(REAL_PRODUCT_DATABASE)) {
    const productName = key.toLowerCase();
    const productCategory = product.category.toLowerCase();
    
    // Check for exact match or partial match
    if (productName.includes(detectedName.toLowerCase()) || 
        detectedName.toLowerCase().includes(productName) ||
        searchTerms.some(term => productName.includes(term))) {
      return product;
    }
    
    // Fallback to category match
    if (productCategory === category.toLowerCase()) {
      return product;
    }
  }
  
  // Return enhanced fallback if no match
  return {
    category: category,
    specs: {
      display: 'High quality display',
      processor: 'Fast processor',
      camera: 'Quality camera system',
      battery: 'Long lasting battery',
      storage: 'Multiple storage options'
    },
    priceHistory: [299, 249, 199, 149],
    currentPrice: 199,
    priceRange: '$149-$299',
    reviews: {
      average: 4.2,
      total: Math.floor(Math.random() * 10000) + 5000,
      sentiment: 0.78,
      summary: `Quality ${category.toLowerCase()} with good user reviews and reliable performance.`,
      common: 'Users appreciate the quality and value',
      pros: ['Good quality', 'Reliable performance', 'Great value'],
      cons: ['Limited availability', 'Generic brand']
    },
    retailers: {
      'Amazon': { price: 199, stock: true, rating: 4.1, shipping: 'Free shipping' },
      'Best Buy': { price: 229, stock: true, rating: 4.0, shipping: '$4.99 shipping' },
      'Target': { price: 179, stock: true, rating: 3.9, shipping: 'Free shipping' }
    },
    alternatives: [
      { name: 'Premium Alternative', price: 179, rating: 4.0, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Budget Option', price: 149, rating: 3.8, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80' }
    ]
  };
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
    if (!params.objectName) {
      // Fallback data if no params
      return {
        objectName: 'Unknown Product',
        category: 'General',
        confidence: '0.85',
        description: 'Product detected but not identified',
        features: JSON.stringify(['Feature 1', 'Feature 2']),
        priceRange: '$50-$100',
        alternatives: JSON.stringify(['Alternative 1', 'Alternative 2']),
        imageUri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'
      };
    }
    
    // Use enhanced realistic database
    const realProduct = findProductInDatabase(
      (params.objectName as string) || 'Unknown Product',
      (params.category as string) || 'General'
    );
    
    return {
      objectName: realProduct.category ? (params.objectName as string) || 'Unknown Product' : 'Unknown Product',
      category: realProduct.category,
      confidence: (params.confidence as string) || '0.85',
      description: realProduct.reviews?.summary || 'Product detected but not identified',
      features: realProduct.specs ? JSON.stringify(Object.values(realProduct.specs)) : JSON.stringify(['Feature 1', 'Feature 2']),
      priceRange: realProduct.priceRange || '$50-$100',
      alternatives: JSON.stringify(realProduct.alternatives?.map((alt: any) => alt.name) || ['Alternative 1', 'Alternative 2']),
      imageUri: (params.imageUri as string) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'
    };
  }, [params]);

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
  
  // Get extended product data for internal use
  const extendedProductData = useMemo(() => {
    const realProduct = findProductInDatabase(
      (params.objectName as string) || 'Unknown Product',
      (params.category as string) || 'General'
    );
    return realProduct;
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="menu" size={22} color="#111827" />
          </TouchableOpacity>
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
            <Text style={styles.heroCategory}>AI Confidence: {Math.round(parseFloat(detectedProduct.confidence) * 100)}%</Text>
            <TouchableOpacity style={styles.shareBtn} activeOpacity={0.9}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.collapsibleSection}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => setOverviewExpanded(!overviewExpanded)}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Product Overview</Text>
            <Ionicons 
              name={overviewExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#111827" 
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
          {overviewExpanded && (
            <View style={styles.sectionContent}>
              <Text style={styles.bodyText}>{detectedProduct.description || 'Product detected but not identified'}</Text>
              <View style={styles.bulletsRow}>
                <View style={{ flex: 1, gap: 8 }}>
                  {features.slice(0, Math.ceil(features.length / 2)).map((feature: any, index: number) => (
                    <View key={index} style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                  {features.slice(Math.ceil(features.length / 2)).map((feature: any, index: number) => (
                    <View key={index} style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deal Score</Text>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View style={styles.scoreCircle}>
              <View style={styles.scoreRing} />
              <Text style={styles.scoreNum}>85</Text>
              <Text style={styles.scoreOut}>/100</Text>
              <Text style={styles.scoreVerdict}>Strong Deal</Text>
            </View>

            <View style={{ flex: 1 }}>
              {dealRows.map((r: any) => (
                <View key={r.id} style={styles.dealRow}>
                  <Text style={styles.dealLabel}>{r.label}</Text>
                  <View style={styles.dealTrack}>
                    <View style={[styles.dealFill, { width: `${r.value}%` }]} />
                  </View>
                  <Text style={styles.dealNum}>{r.value}</Text>
                  <View style={styles.dealPill}>
                    <Text style={styles.dealPillText}>{r.pill}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.hr} />
        <View style={styles.collapsibleSection}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => setAiSummaryExpanded(!aiSummaryExpanded)}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>AI Summary</Text>
            <Ionicons 
              name={aiSummaryExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#111827" 
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
          {aiSummaryExpanded && (
            <View style={styles.sectionContent}>
              <Text style={styles.bodyText}>Price is well below market average and maintains strong willingness. More info here.</Text>
              <Text style={styles.bodyText}>AI detected this {detectedProduct.category?.toLowerCase() || 'product'} with {Math.round(parseFloat(detectedProduct.confidence || '0.85') * 100)}% confidence. Key features include {features.slice(0, 3).join(', ').toLowerCase()}.</Text>
              <Text style={styles.bodyText}>Market analysis shows this product is currently {parseFloat(detectedProduct.confidence || '0.85') > 0.85 ? 'underpriced' : 'fairly priced'} compared to similar items in the {detectedProduct.category?.toLowerCase() || 'product'} category.</Text>
            </View>
          )}
        </View>
        </View>

        <Text style={styles.sectionTitle}>Price Intelligence</Text>
        <View style={[styles.twoCol, { paddingHorizontal: 18 }]}>
          <View style={[styles.smallCard, { width: half }]}>
            <Text style={styles.smallTitle}>Market History</Text>
            <View style={styles.rangeRow}>
              {(['90D', '3M', '1Y'] as RangeKey[]).map((k) => (
                <TouchableOpacity key={k} style={[styles.rangeTab, range === k && styles.rangeTabActive]} onPress={() => setRange(k)}>
                  <Text style={[styles.rangeText, range === k && styles.rangeTextActive]}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chartBox}>
              <View style={[styles.grid, { top: '25%' }]} />
              <View style={[styles.grid, { top: '50%' }]} />
              <View style={[styles.grid, { top: '75%' }]} />
              <View style={styles.chartStroke} />
              <View style={styles.chartFillBox} />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statValue}>$24.99</Text>
                <Text style={styles.statLabel}>current</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statValue}>$999</Text>
                <Text style={styles.statLabel}>average</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statValue}>$849</Text>
                <Text style={styles.statLabel}>lowest</Text>
              </View>
            </View>
            <View style={styles.goodPill}>
              <Text style={styles.goodText}>Good time to buy</Text>
            </View>
          </View>

          <View style={[styles.smallCard, { width: half }]}>
            <View style={styles.bestHeader}>
              <Text style={styles.smallTitle}>Best Price vs Market</Text>
              <Ionicons name="bookmark-outline" size={18} color="#9CA3AF" />
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
              <View style={styles.thumb}>
                <Image source={{ uri: detectedProduct.imageUri }} style={styles.thumbImg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallMuted}>Newegg</Text>
                <Text style={styles.bestName}>Lenovo Thin…</Text>
                <Text style={styles.bestPrice}>$24.99</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
                  <Text style={styles.ratingText}>4.2</Text>
                  <Text style={styles.ratingMuted}>(17.3k)</Text>
                </View>
              </View>
            </View>
            <View style={styles.bestPills}>
              <View style={styles.bestPill}>
                <Text style={styles.bestPillText}>-$10 Ave Price</Text>
              </View>
              <Text style={styles.inStock}>In Stock</Text>
            </View>
            <Text style={styles.muted}>Best value for premium quality and features in this category.</Text>
            <TouchableOpacity style={styles.visitBtn} activeOpacity={0.9}>
              <Text style={styles.visitText}>Visit Store</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Store Comparison</Text>
        <View style={styles.card}>
          {stores.map((s: any, idx: number) => (
            <View key={s.id} style={[styles.storeRow, idx !== stores.length - 1 && styles.rowBorder]}>
              <View style={styles.storeThumb}>
                <Image source={{ uri: s.image }} style={styles.storeThumbImg} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.storeTop}>
                  <Text style={styles.storeName}>{s.store}</Text>
                  <Text style={styles.shipText}>{s.ship}</Text>
                </View>
                <Text style={styles.storeProd} numberOfLines={1}>
                  {s.name}
                </Text>
                <Text style={styles.storePrice}>{s.price}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.9}>
            <Text style={styles.outlineText}>View More Stores</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Review Summary</Text>
        <Text style={[styles.muted, { paddingHorizontal: 18, marginTop: -4 }]}>Based on 1,312 reviews across major retailers (Amazon, Bestbuy, Walmart…)</Text>
        <View style={styles.reviewBox}>
          <View style={styles.reviewTag}>
            <Text style={styles.reviewTagText}>Mostly Positive</Text>
          </View>
          <Text style={styles.reviewLine}>Most praised: sound quality & comfort compliance.</Text>
          <Text style={styles.reviewLine}>Common battery aging after long term use.</Text>
        </View>

        <View style={styles.trustHeader}>
          <Text style={styles.trustTitle}>Trust Check</Text>
          <Text style={styles.muted}>Low likelihood of fake/unverified reviews.</Text>
        </View>
        <Text style={styles.confidence}>High Confidence</Text>
        <View style={styles.trustTrack}>
          <View style={styles.trustFill} />
        </View>
        <View style={styles.sentiments}>
          <View style={styles.sentRow}>
            <Text style={styles.sentLabel}>Quality</Text>
            <View style={[styles.sentPill, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.sentText}>Positive</Text>
            </View>
          </View>
          <View style={styles.sentRow}>
            <Text style={styles.sentLabel}>Warranty</Text>
            <View style={[styles.sentPill, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.sentText, { color: '#B45309' }]}>Fair</Text>
            </View>
          </View>
          <View style={styles.sentRow}>
            <Text style={styles.sentLabel}>Style</Text>
            <View style={[styles.sentPill, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.sentText}>Very Positive</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Alternatives</Text>
        <Text style={[styles.muted, { paddingHorizontal: 18, marginTop: -4 }]}>Comparable products with better price, value</Text>
        <View style={styles.card}>
          {alternatives.map((a: any, idx: number) => (
            <View key={a.id} style={[styles.altRow, idx !== alternatives.length - 1 && styles.rowBorder]}>
              <View style={styles.altThumb}>
                <Image source={{ uri: a.image }} style={styles.altThumbImg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallMuted}>{a.store}</Text>
                <Text style={styles.altName} numberOfLines={2}>
                  {a.name}
                </Text>
                <Text style={styles.altPrice}>{a.price}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 10 }}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{a.tag}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
                  <Text style={styles.ratingText}>{a.rating.toFixed(1)}</Text>
                  <Text style={styles.ratingMuted}>{a.reviews}</Text>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.9}>
            <Text style={styles.outlineText}>View all alternatives</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={() => router.replace('/(tabs)/camera')}>
            <Text style={styles.primaryText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.9}>
            <Text style={styles.secondaryText}>Fix Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerRow: { paddingHorizontal: 16, paddingTop: 6, flexDirection: 'row', alignItems: 'center' },
  headerBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

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
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0E9F6E', marginTop: 6 },
  bulletText: { flex: 1, fontSize: 11, color: '#111827', fontWeight: '600', lineHeight: 16, fontFamily: DEALO_FONT_FAMILY },

  card: { marginTop: 14, marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#EEF2F7', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 4 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 8, fontFamily: DEALO_FONT_FAMILY },
  muted: { fontSize: 12, lineHeight: 18, color: '#6B7280', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },
  smallMuted: { fontSize: 10, fontWeight: '600', color: '#6B7280', marginBottom: 2, fontFamily: DEALO_FONT_FAMILY },
  hr: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },

  scoreCircle: { width: 88, alignItems: 'center' },
  scoreRing: { width: 74, height: 74, borderRadius: 37, borderWidth: 8, borderColor: '#0E9F6E', borderRightColor: '#E5E7EB' },
  scoreNum: { position: 'absolute', top: 16, fontSize: 24, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  scoreOut: { position: 'absolute', top: 46, fontSize: 10, fontWeight: '800', color: '#9CA3AF', fontFamily: DEALO_FONT_FAMILY },
  scoreVerdict: { marginTop: 8, fontSize: 11, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  dealRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dealLabel: { width: 68, fontSize: 11, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  dealTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden', marginHorizontal: 8 },
  dealFill: { height: '100%', backgroundColor: '#0E9F6E', borderRadius: 999 },
  dealNum: { width: 28, textAlign: 'right', fontSize: 11, fontWeight: '900', color: '#111827', marginRight: 8, fontFamily: DEALO_FONT_FAMILY },
  dealPill: { height: 24, borderRadius: 999, backgroundColor: '#D1FAE5', paddingHorizontal: 10, justifyContent: 'center', marginRight: 8 },
  dealPillText: { fontSize: 9, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },

  twoCol: { flexDirection: 'row', gap: 12 },
  smallCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#EEF2F7', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 14, elevation: 4 },
  smallTitle: { fontSize: 14, fontWeight: '900', color: '#111827', marginBottom: 6, fontFamily: DEALO_FONT_FAMILY },
  rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  rangeTab: { paddingHorizontal: 8, height: 24, borderRadius: 999, justifyContent: 'center' },
  rangeTabActive: { backgroundColor: '#E5E7EB' },
  rangeText: { fontSize: 10, fontWeight: '800', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  rangeTextActive: { color: '#0E9F6E' },
  chartBox: { height: 112, borderRadius: 12, overflow: 'hidden', marginBottom: 10, backgroundColor: '#fff' },
  grid: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#E5E7EB' },
  chartStroke: { position: 'absolute', left: 8, top: 58, width: 104, height: 3, backgroundColor: '#0E9F6E', borderRadius: 2, transform: [{ rotate: '-10deg' }] },
  chartFillBox: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(5,150,105,0.10)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCol: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 13, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#6B7280', marginTop: 3, fontFamily: DEALO_FONT_FAMILY },
  goodPill: { height: 36, borderRadius: 999, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' },
  goodText: { fontSize: 11, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },
  bestHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  thumb: { width: 52, height: 52, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bestName: { fontSize: 13, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  bestPrice: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  bestPills: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  bestPill: { height: 24, borderRadius: 999, backgroundColor: '#D1FAE5', paddingHorizontal: 10, justifyContent: 'center' },
  bestPillText: { fontSize: 11, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },
  inStock: { fontSize: 12, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },
  visitBtn: { height: 36, borderRadius: 999, backgroundColor: '#0E9F6E', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
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
  reviewTag: { alignSelf: 'flex-start', backgroundColor: '#059669', paddingHorizontal: 12, height: 26, borderRadius: 8, justifyContent: 'center', marginBottom: 10 },
  reviewTagText: { color: '#fff', fontWeight: '900', fontSize: 12, fontFamily: DEALO_FONT_FAMILY },
  reviewLine: { fontSize: 14, color: '#111827', fontWeight: '600', lineHeight: 20, fontFamily: DEALO_FONT_FAMILY },
  trustHeader: { paddingHorizontal: 16, marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trustTitle: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  confidence: { paddingHorizontal: 16, marginTop: 8, fontSize: 16, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },
  trustTrack: { height: 8, borderRadius: 999, backgroundColor: '#E5E7EB', marginHorizontal: 16, marginTop: 8, overflow: 'hidden' },
  trustFill: { width: '72%', height: '100%', backgroundColor: '#059669', borderRadius: 999 },
  sentiments: { paddingHorizontal: 16, marginTop: 12, gap: 10 },
  sentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sentLabel: { fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  sentPill: { height: 28, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
  sentText: { fontSize: 12, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },

  altRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  altThumb: { width: 68, height: 68, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  altThumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  altName: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 4, fontFamily: DEALO_FONT_FAMILY },
  altPrice: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  tagPill: { height: 28, borderRadius: 8, backgroundColor: '#D1FAE5', paddingHorizontal: 12, justifyContent: 'center' },
  tagText: { fontSize: 12, fontWeight: '900', color: '#059669', fontFamily: DEALO_FONT_FAMILY },

  bottomRow: { paddingHorizontal: 16, marginTop: 18, flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, height: 52, borderRadius: 999, backgroundColor: '#0E9F6E', justifyContent: 'center', alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '900', fontFamily: DEALO_FONT_FAMILY },
  secondaryBtn: { flex: 1, height: 52, borderRadius: 999, borderWidth: 3, borderColor: '#0E9F6E', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  secondaryText: { color: '#0E9F6E', fontSize: 16, fontWeight: '900', fontFamily: 'System' },
});
