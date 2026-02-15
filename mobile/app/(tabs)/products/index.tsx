import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#0E9F6E';

type Product = {
  id: string;
  brand: string;
  product: string;
  category: string;
  badge: string;
  image: string;
};

const HERO_PRODUCT: Product = {
  id: 'hero-1',
  brand: "Levi's",
  product: 'Light Blue Denim Jacket',
  category: 'Jackets',
  badge: '$20 Off',
  image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=1400&q=80',
};

const SIMILAR: Product[] = [
  {
    id: 's1',
    brand: "Levi's",
    product: 'Light Blue Denim Jacket',
    category: 'Jackets',
    badge: '$20 Off',
    image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 's2',
    brand: 'GAP',
    product: 'Light Wash Denim Jacket',
    category: 'Jackets',
    badge: '15% Off',
    image: 'https://images.unsplash.com/photo-1520975805824-37e8b79b8f77?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 's3',
    brand: "Levi's",
    product: 'Cropped Denim Jacket',
    category: 'Jackets',
    badge: '$10 Off',
    image: 'https://images.unsplash.com/photo-1520975975703-3de1b6f23cf8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 's4',
    brand: 'H&M',
    product: 'Light Wash Denim Jacket',
    category: 'Jackets',
    badge: '20% Off',
    image: 'https://images.unsplash.com/photo-1520975858438-1d2a5c6d7b39?auto=format&fit=crop&w=900&q=80',
  },
];

function getInitial(brand: string) {
  const b = (brand ?? '').trim();
  return b ? b.slice(0, 1).toUpperCase() : 'D';
}

export default function ProductsIndex() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const enterY = useRef(new Animated.Value(30)).current;
  const enterOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(enterY, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.timing(enterOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [enterOpacity, enterY]);

  const data = useMemo(() => SIMILAR, []);

  const renderItem = ({ item }: ListRenderItemInfo<Product>) => {
    const isLiked = !!liked[item.id];

    return (
      <Pressable
        onPress={() => {
          setLiked((p) => p);
        }}
        style={({ pressed }) => [styles.tile, pressed && { opacity: 0.95 }]}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{item.badge}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.heartIcon, isLiked ? styles.heartIconActive : null]}
            onPress={() => setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
          >
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.brandCircle}>
            <Text style={styles.brandCircleText}>{getInitial(item.brand)}</Text>
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
      </Pressable>
    );
  };

  const heroLiked = !!liked[HERO_PRODUCT.id];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="sun" cx="-8%" cy="-12%" rx="95%" ry="95%" fx="-8%" fy="-12%">
              <Stop offset="0" stopColor="#B9F6D2" stopOpacity={0.95} />
              <Stop offset="0.22" stopColor="#34D399" stopOpacity={0.6} />
              <Stop offset="0.52" stopColor={BRAND_GREEN} stopOpacity={0.26} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#sun)" />
          <Rect x="0" y="0" width="100%" height="55%" fill="url(#fadeDown)" />
        </Svg>
      </View>

      <Animated.View style={{ flex: 1, transform: [{ translateY: enterY }], opacity: enterOpacity }}>
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.headerRow}>
                <View style={{ width: 40 }} />
                <View style={styles.headerRight}>
                  <TouchableOpacity activeOpacity={0.85} style={styles.menuBtn}>
                    <Ionicons name="menu" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.heroCard}>
                <View style={styles.heroImageWrap}>
                  <Image source={{ uri: HERO_PRODUCT.image }} style={styles.heroImage} />
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.heroHeart, heroLiked ? styles.heartIconActive : null]}
                    onPress={() => setLiked((prev) => ({ ...prev, [HERO_PRODUCT.id]: !prev[HERO_PRODUCT.id] }))}
                  >
                    <Ionicons name={heroLiked ? 'heart' : 'heart-outline'} size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.heroTitle} numberOfLines={1}>
                  {HERO_PRODUCT.product}
                </Text>
                <Text style={styles.heroBrand} numberOfLines={1}>
                  {HERO_PRODUCT.brand}
                </Text>

                <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Analyze Product</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.9} style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Visit Store →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Similar Items</Text>
              </View>
            </View>
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingBottom: 120,
  },

  headerRow: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  heroCard: {
    marginHorizontal: 18,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
  },
  heroImageWrap: {
    alignSelf: 'center',
    width: Math.min(260, width - 120),
    height: Math.min(260, width - 120),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 14,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroHeart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  heroBrand: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  primaryBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 14,
    backgroundColor: BRAND_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    marginTop: 10,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  sectionHead: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
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
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: BRAND_GREEN,
  },
  discountBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.15,
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
});
