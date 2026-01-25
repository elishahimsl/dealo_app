import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const defaultProductLeft = {
  name: 'iPhone 16',
  price: '$999',
  rating: 4.5,
  reviews: '17.4k Reviews',
  image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
};

const defaultProductRight = {
  name: 'Samsung S24',
  price: '$899',
  rating: 4.7,
  reviews: '12.1k Reviews',
  image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
};

const metrics = [
  { id: 'price', label: 'Price', a: 92, b: 85 },
  { id: 'durability', label: 'Durability', a: 85, b: 85 },
  { id: 'reviews', label: 'Reviews', a: 83, b: 85 },
  { id: 'brand', label: 'Brand Reputation', a: 85, b: 89 },
  { id: 'features', label: 'Features', a: 88, b: 82 },
  { id: 'design', label: 'Design', a: 90, b: 84 },
];

const getStoreOptions = (a: { name: string; image: string }, b: { name: string; image: string }) => {
  const opts: Record<string, { id: string; store: string; name: string; price: string; image: string }[]> = {
    [a.name]: [{ id: 'a1', store: 'Amazon', name: a.name, price: '$299', image: a.image }],
    [b.name]: [
      { id: 'b1', store: 'Amazon', name: b.name, price: '$319', image: b.image },
      { id: 'b2', store: 'Best Buy', name: b.name, price: '$329', image: b.image },
      { id: 'b3', store: 'Walmart', name: b.name, price: '$299', image: b.image },
    ],
  };

  return opts;
};

const alternatives = [
  {
    id: 'alt1',
    price: '$249',
    name: 'Dell XPS 15',
    note: 'Similar but\ncheaper',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'alt2',
    price: '$249',
    name: 'HP Spectre…',
    note: 'Better specs at\nsame price',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'alt3',
    price: '$279',
    name: 'Lenovo…',
    note: 'Best value\noverall',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
];

type RangeKey = '1W' | '1M' | '3M' | '6M' | '1Y';
const ranges: RangeKey[] = ['1W', '1M', '3M', '6M', '1Y'];

export default function CompareResults() {
  const router = useRouter();
  const params = useLocalSearchParams<{ aName?: string; aImage?: string; bName?: string; bImage?: string }>();
  const [range, setRange] = useState<RangeKey>('1M');

  const productLeft = useMemo(() => {
    return {
      ...defaultProductLeft,
      name: params.aName ?? defaultProductLeft.name,
      image: params.aImage ?? defaultProductLeft.image,
    };
  }, [params.aImage, params.aName]);

  const productRight = useMemo(() => {
    return {
      ...defaultProductRight,
      name: params.bName ?? defaultProductRight.name,
      image: params.bImage ?? defaultProductRight.image,
    };
  }, [params.bImage, params.bName]);

  const storeOptions = useMemo(() => getStoreOptions(productLeft, productRight), [productLeft, productRight]);

  const cardWidth = useMemo(() => {
    const padding = 18;
    const gap = 14;
    return (width - padding * 2 - gap) / 2;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comparison Results</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="bookmark-outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.vsWrap}>
          <View style={styles.vsRow}>
            <View style={[styles.productCard, { width: cardWidth }]}>
              <View style={[styles.badge, styles.badgeGreen]}>
                <Text style={styles.badgeText}>LOWEST PRICE</Text>
              </View>
              <View style={styles.productImageArea}>
                <Image source={{ uri: productLeft.image }} style={styles.productImage} />
              </View>
              <Text style={styles.productName} numberOfLines={1}>
                {productLeft.name}
              </Text>
              <Text style={styles.productPrice}>{productLeft.price}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingValue}>{productLeft.rating.toFixed(1)}</Text>
                <Ionicons name="star" size={16} color="#F59E0B" style={styles.starIcon} />
                <Text style={styles.reviewsText}>({productLeft.reviews})</Text>
              </View>
            </View>

            <View style={[styles.productCard, { width: cardWidth }]}>
              <View style={[styles.badge, styles.badgeBlue]}>
                <Text style={styles.badgeText}>POPULAR PICK</Text>
              </View>
              <View style={styles.productImageArea}>
                <Image source={{ uri: productRight.image }} style={styles.productImage} />
              </View>
              <Text style={styles.productName} numberOfLines={1}>
                {productRight.name}
              </Text>
              <Text style={styles.productPrice}>{productRight.price}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingValue}>{productRight.rating.toFixed(1)}</Text>
                <Ionicons name="star" size={16} color="#F59E0B" style={styles.starIcon} />
                <Text style={styles.reviewsText}>({productRight.reviews})</Text>
              </View>
            </View>

            <View style={styles.vsPill}>
              <Text style={styles.vsPillText}>VS</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardKicker}>Best Choice For You</Text>
          <View style={styles.bestRow}>
            <Text style={styles.bestName}>{productLeft.name}</Text>
            <View style={styles.scoreWrap}>
              <Text style={styles.scoreValue}>87</Text>
              <Text style={styles.scoreSuffix}>/100</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '87%' }]} />
          </View>
          <Text style={styles.bestDescription}>
            iPhone 16 offers superior value with better processor performance, more storage capacity (512GB vs 256GB), and enhanced
            battery life (up to 18 hours). The display is brighter with higher resolution, making it ideal for content creation and
            multimedia. Build quality is exceptional with premium materials and better heat management.
          </Text>
        </View>

        <View style={styles.card}>
          {metrics.map((m, idx) => (
            <View key={m.id} style={[styles.metricRow, idx !== metrics.length - 1 && styles.metricRowBorder]}>
              <View style={styles.metricLeft}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Ionicons name="chevron-down" size={18} color="#9CA3AF" style={styles.metricChevron} />
              </View>
              <View style={styles.metricRight}>
                <Text style={styles.metricScoreA}>{m.a}</Text>
                <Text style={styles.metricScoreB}>{m.b}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.priceHistoryTitle}>Price History</Text>

          <View style={styles.rangeRow}>
            {ranges.map((r) => (
              <TouchableOpacity
                key={r}
                activeOpacity={0.9}
                onPress={() => setRange(r)}
                style={[styles.rangePill, r === range && styles.rangePillActive]}
              >
                <Text style={[styles.rangeText, r === range && styles.rangeTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.chartWrap}>
            <View style={styles.chartGridLine} />
            <View style={[styles.chartGridLine, { top: '50%' }]} />
            <View style={[styles.chartGridLine, { top: '75%' }]} />

            <View style={styles.chartLineBlueA} />
            <View style={styles.chartLineBlueB} />
            <View style={styles.chartLineBlueC} />

            <View style={styles.chartLineGreenA} />
            <View style={styles.chartLineGreenB} />
            <View style={styles.chartLineGreenC} />

            <View style={styles.chartFadeBlue} />
            <View style={styles.chartFadeGreen} />
          </View>

          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipBlue]}>
              <Text style={styles.chipTextBlue}>↓ Lowest in 60 days</Text>
            </View>
            <View style={[styles.chip, styles.chipGreen]}>
              <Text style={styles.chipTextGreen}>↓ Likely to drop soon</Text>
            </View>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>{productLeft.name}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.legendText}>{productRight.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Store Options</Text>

          <Text style={styles.storeProductTitle}>{productLeft.name}</Text>
          {storeOptions[productLeft.name].map((o) => (
            <View key={o.id} style={styles.storeRow}>
              <View style={styles.storeThumb}>
                <Image source={{ uri: o.image }} style={styles.storeThumbImg} />
              </View>
              <View style={styles.storeText}>
                <Text style={styles.storeName}>{o.store}</Text>
                <Text style={styles.storeProductName}>{o.name}</Text>
                <Text style={styles.storePrice}>{o.price}</Text>
              </View>
              <TouchableOpacity style={styles.goButton} activeOpacity={0.9}>
                <Text style={styles.goText}>Go</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.storeProductTitle, { marginTop: 14 }]}>{productRight.name}</Text>
          {storeOptions[productRight.name].map((o) => (
            <View key={o.id} style={styles.storeRow}>
              <View style={styles.storeThumb}>
                <Image source={{ uri: o.image }} style={styles.storeThumbImg} />
              </View>
              <View style={styles.storeText}>
                <Text style={styles.storeName}>{o.store}</Text>
                <Text style={styles.storeProductName}>{o.name}</Text>
                <Text style={styles.storePrice}>{o.price}</Text>
              </View>
              <TouchableOpacity style={styles.goButton} activeOpacity={0.9}>
                <Text style={styles.goText}>Go</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI Alternatives</Text>
          <FlatList
            data={alternatives}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.altList}
            renderItem={({ item }) => (
              <View style={styles.altCard}>
                <View style={styles.altImageWrap}>
                  <Image source={{ uri: item.image }} style={styles.altImage} />
                  <TouchableOpacity style={styles.altHeart}>
                    <Ionicons name="heart-outline" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.altPrice}>{item.price}</Text>
                <Text style={styles.altName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.altNote} numberOfLines={2}>
                  {item.note}
                </Text>
              </View>
            )}
          />
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
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsWrap: {
    paddingHorizontal: 18,
    marginTop: 8,
  },
  vsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  vsPill: {
    position: 'absolute',
    left: '50%',
    top: 90,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#F9FAFB',
  },
  vsPillText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6B7280',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingTop: 22,
  },
  badge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeGreen: {
    backgroundColor: '#059669',
  },
  badgeBlue: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  productImageArea: {
    height: 110,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginRight: 6,
  },
  starIcon: {
    marginRight: 6,
  },
  reviewsText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  card: {
    marginTop: 18,
    marginHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  cardKicker: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 10,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bestName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 40,
  },
  scoreSuffix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9CA3AF',
    marginLeft: 4,
    marginBottom: 4,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 999,
  },
  bestDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  metricRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginRight: 10,
  },
  metricChevron: {
    marginTop: 2,
  },
  metricRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
  },
  metricScoreA: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
  },
  metricScoreB: {
    fontSize: 26,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  priceHistoryTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rangePill: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rangePillActive: {
    backgroundColor: '#E5E7EB',
  },
  rangeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6B7280',
  },
  rangeTextActive: {
    color: '#111827',
  },
  chartWrap: {
    height: 260,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
  },
  chartGridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    height: 2,
    backgroundColor: '#E5E7EB',
    opacity: 0.7,
  },
  chartFadeBlue: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(59,130,246,0.10)',
  },
  chartFadeGreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    bottom: 0,
    backgroundColor: 'rgba(5,150,105,0.10)',
  },
  chartLineBlueA: {
    position: 'absolute',
    left: 14,
    top: 70,
    width: 110,
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    transform: [{ rotate: '-10deg' }],
  },
  chartLineBlueB: {
    position: 'absolute',
    left: 114,
    top: 52,
    width: 120,
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    transform: [{ rotate: '12deg' }],
  },
  chartLineBlueC: {
    position: 'absolute',
    left: 226,
    top: 78,
    width: 120,
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    transform: [{ rotate: '-8deg' }],
  },
  chartLineGreenA: {
    position: 'absolute',
    left: 14,
    top: 120,
    width: 120,
    height: 4,
    backgroundColor: '#059669',
    borderRadius: 2,
    transform: [{ rotate: '8deg' }],
  },
  chartLineGreenB: {
    position: 'absolute',
    left: 126,
    top: 142,
    width: 110,
    height: 4,
    backgroundColor: '#059669',
    borderRadius: 2,
    transform: [{ rotate: '-12deg' }],
  },
  chartLineGreenC: {
    position: 'absolute',
    left: 226,
    top: 132,
    width: 120,
    height: 4,
    backgroundColor: '#059669',
    borderRadius: 2,
    transform: [{ rotate: '6deg' }],
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  chipBlue: {
    backgroundColor: 'rgba(59,130,246,0.14)',
  },
  chipGreen: {
    backgroundColor: 'rgba(5,150,105,0.14)',
  },
  chipTextBlue: {
    color: '#2563EB',
    fontWeight: '900',
    fontSize: 18,
  },
  chipTextGreen: {
    color: '#059669',
    fontWeight: '900',
    fontSize: 18,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 22,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  legendText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 14,
  },
  storeProductTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 10,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  storeThumb: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 14,
    overflow: 'hidden',
  },
  storeThumbImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storeText: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
  },
  storeProductName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  storePrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  goButton: {
    width: 64,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },
  goText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6B7280',
  },
  altList: {
    paddingRight: 8,
  },
  altCard: {
    width: 170,
    marginRight: 14,
  },
  altImageWrap: {
    height: 112,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginBottom: 10,
  },
  altImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  altHeart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  altPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  altName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  altNote: {
    fontSize: 16,
    lineHeight: 22,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
