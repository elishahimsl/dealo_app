import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const DEALO_FONT_FAMILY = 'Manrope-Regular';
const BRAND_GREEN = '#0E9F6E';
const ACCENT_COLOR = '#2563EB';

const defaultProductLeft = {
  brand: 'Apple',
  name: 'iPhone 16',
  price: '$999',
  rating: 4.5,
  reviews: '17.4k Reviews',
  image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
};

const defaultProductRight = {
  brand: 'Samsung',
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

type RangeKey = '30D' | '90D' | '1Y';
const ranges: RangeKey[] = ['30D', '90D', '1Y'];

const PRICE_HISTORY_POINTS: Record<RangeKey, { a: number[]; b: number[]; xTicks: string[] }> = {
  '30D': { a: [229, 225, 221, 219, 210, 214, 205, 206, 199], b: [249, 246, 240, 236, 231, 229, 223, 226, 218], xTicks: ['2', '12', '21', '31'] },
  '90D': { a: [249, 244, 235, 229, 221, 219, 210, 214, 205], b: [269, 264, 260, 252, 245, 240, 231, 229, 223], xTicks: ['1', '30', '60', '90'] },
  '1Y': { a: [289, 281, 275, 269, 262, 258, 249, 244, 235], b: [309, 300, 295, 289, 282, 276, 269, 264, 260], xTicks: ['1', '120', '240', '365'] },
};

function getInitial(label: string) {
  const trimmed = label.trim();
  return trimmed ? trimmed[0]?.toUpperCase() ?? '' : '';
}

function toNiceCeil(n: number, step: number) {
  return Math.ceil(n / step) * step;
}

function toNiceFloor(n: number, step: number) {
  return Math.floor(n / step) * step;
}

function TwoLineChart({ aPoints, bPoints, w, h }: { aPoints: number[]; bPoints: number[]; w: number; h: number }) {
  const pad = 10;
  const all = [...aPoints, ...bPoints];
  const minRaw = Math.min(...all);
  const maxRaw = Math.max(...all);
  const max = toNiceCeil(maxRaw, 10);
  const min = toNiceFloor(minRaw, 10);
  const span = Math.max(1, max - min);

  const xs = aPoints.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, aPoints.length - 1));
  const yA = aPoints.map((p) => pad + ((max - p) * (h - pad * 2)) / span);
  const yB = bPoints.map((p) => pad + ((max - p) * (h - pad * 2)) / span);
  const dA = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yA[i].toFixed(1)}`).join(' ');
  const dB = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yB[i].toFixed(1)}`).join(' ');
  const areaA = `${dA} L ${(pad + (w - pad * 2)).toFixed(1)} ${(h - pad).toFixed(1)} L ${pad.toFixed(1)} ${(h - pad).toFixed(1)} Z`;
  const areaB = `${dB} L ${(pad + (w - pad * 2)).toFixed(1)} ${(h - pad).toFixed(1)} L ${pad.toFixed(1)} ${(h - pad).toFixed(1)} Z`;

  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BRAND_GREEN} stopOpacity="0.24" />
          <Stop offset="1" stopColor={BRAND_GREEN} stopOpacity="0.03" />
        </LinearGradient>
        <LinearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={ACCENT_COLOR} stopOpacity="0.18" />
          <Stop offset="1" stopColor={ACCENT_COLOR} stopOpacity="0.02" />
        </LinearGradient>
      </Defs>
      <Path d={areaB} fill="url(#gB)" />
      <Path d={areaA} fill="url(#gA)" />
      <Path d={dB} stroke={ACCENT_COLOR} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d={dA} stroke={BRAND_GREEN} strokeWidth={3} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export default function CompareResults() {
  const router = useRouter();
  const params = useLocalSearchParams<{ aName?: string; aImage?: string; bName?: string; bImage?: string }>();
  const [range, setRange] = useState<RangeKey>('30D');
  const [bestOverviewOpen, setBestOverviewOpen] = useState(false);
  const [aiOverviewOpen, setAiOverviewOpen] = useState(false);

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

  const scoreA = useMemo(() => Math.round(metrics.reduce((s, m) => s + m.a, 0) / metrics.length), []);
  const scoreB = useMemo(() => Math.round(metrics.reduce((s, m) => s + m.b, 0) / metrics.length), []);
  const winner = scoreA >= scoreB ? 'A' : 'B';

  const bestProduct = winner === 'A' ? productLeft : productRight;
  const otherProduct = winner === 'A' ? productRight : productLeft;
  const bestColor = winner === 'A' ? BRAND_GREEN : ACCENT_COLOR;

  const storeOptions = useMemo(() => getStoreOptions(productLeft, productRight), [productLeft, productRight]);

  const otherStores = useMemo(() => {
    const left = (storeOptions[productLeft.name] ?? []).map((o) => ({
      id: `a-${o.id}`,
      save: 'Save $20',
      store: o.store,
      name: o.name,
      price: o.price,
    }));
    const right = (storeOptions[productRight.name] ?? []).map((o) => ({
      id: `b-${o.id}`,
      save: 'Save $15',
      store: o.store,
      name: o.name,
      price: o.price,
    }));
    return [...left, ...right];
  }, [productLeft.name, productRight.name, storeOptions]);

  const cardWidth = useMemo(() => {
    const padding = 18;
    const gap = 14;
    return (width - padding * 2 - gap) / 2;
  }, []);

  const bestBrand = (bestProduct as any).brand ?? bestProduct.name.split(' ')[0];
  const otherBrand = (otherProduct as any).brand ?? otherProduct.name.split(' ')[0];
  const bestPricePoints = PRICE_HISTORY_POINTS[range][winner === 'A' ? 'a' : 'b'];
  const bestAvg = Math.round(bestPricePoints.reduce((s, p) => s + p, 0) / bestPricePoints.length);
  const bestToday = bestPricePoints[bestPricePoints.length - 1] ?? bestPricePoints[0] ?? 0;
  const bestLow = Math.min(...bestPricePoints);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compare Results</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.vsWrap}>
          <View style={styles.compareRowWrap}>
            <View style={styles.compareRow}>
            <View style={[styles.compareTile, { width: cardWidth, marginRight: 14 }]}>
              <View style={styles.compareProductBlank} />
              <View style={styles.compareMetaRow}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoInitial}>{getInitial((productLeft as any).brand ?? productLeft.name)}</Text>
                </View>
                <View style={styles.topMetaRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.brandText}>{(productLeft as any).brand ?? productLeft.name.split(' ')[0]}</Text>
                    <Text style={styles.productText} numberOfLines={1}>
                      {productLeft.name}
                    </Text>
                  </View>
                  <Text style={styles.priceInline}>{productLeft.price}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.compareTile, { width: cardWidth }]}>
              <View style={styles.compareProductBlank} />
              <View style={styles.compareMetaRow}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoInitial}>{getInitial((productRight as any).brand ?? productRight.name)}</Text>
                </View>
                <View style={styles.topMetaRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.brandText}>{(productRight as any).brand ?? productRight.name.split(' ')[0]}</Text>
                    <Text style={styles.productText} numberOfLines={1}>
                      {productRight.name}
                    </Text>
                  </View>
                  <Text style={styles.priceInline}>{productRight.price}</Text>
                </View>
              </View>
            </View>
            </View>
          </View>
        </View>

        <View style={styles.bestDealCard}>
          <View style={styles.bestDealHeader}>
            <Text style={styles.bestDealTitle}>Best Deal for You</Text>
          </View>
          <View style={styles.bestDealBody}>
            <View style={styles.bestDealThumb} />
            <View style={{ flex: 1 }}>
              <View style={styles.bestDealMetaRow}>
                <View style={styles.logoCircleSm}>
                  <Text style={styles.logoInitialSm}>{getInitial(bestBrand)}</Text>
                </View>
                <View style={styles.bestDealTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bestDealBrand}>{bestBrand}</Text>
                    <Text style={styles.bestDealProduct} numberOfLines={1}>
                      {bestProduct.name}
                    </Text>
                  </View>
                  <Text style={styles.bestDealPriceInline}>{bestProduct.price}</Text>
                </View>
              </View>
              <Text style={styles.bestDealReviews}>{bestProduct.reviews}</Text>
              <TouchableOpacity activeOpacity={0.9} style={[styles.visitBtn, { backgroundColor: bestColor }]}>
                <Text style={styles.visitText}>Visit Store</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.overviewHeaderRow}
            onPress={() => setBestOverviewOpen((v) => !v)}
          >
            <View style={styles.overviewInline}>
              <Text style={styles.overviewHeader}>Overview</Text>
              <Ionicons name={bestOverviewOpen ? 'chevron-up' : 'chevron-down'} size={18} color={BRAND_GREEN} style={styles.overviewChevron} />
            </View>
          </TouchableOpacity>
          <Text style={styles.overviewText} numberOfLines={bestOverviewOpen ? undefined : 2}>
            {bestBrand} {bestProduct.name} offers better overall value based on price, feature balance, and recent pricing trends compared to {otherBrand} {otherProduct.name}.
          </Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.aiDealScoreTitle}>AI deal score</Text>
          <View style={styles.scoreCircleRow}>
            <View style={styles.scoreCircleWrap}>
              <View style={[styles.scoreCircle, { borderColor: BRAND_GREEN }]}>
                <Text style={styles.scoreCircleNum}>{scoreA}</Text>
                <Text style={styles.scoreCircleOut}>/100</Text>
              </View>
              <Text style={styles.scoreCircleLabel}>{(productLeft as any).brand ?? productLeft.name.split(' ')[0]}</Text>
            </View>

            <Text style={styles.scoreVersus}>versus</Text>

            <View style={styles.scoreCircleWrap}>
              <View style={[styles.scoreCircle, { borderColor: ACCENT_COLOR }]}>
                <Text style={styles.scoreCircleNum}>{scoreB}</Text>
                <Text style={styles.scoreCircleOut}>/100</Text>
              </View>
              <Text style={styles.scoreCircleLabel}>{(productRight as any).brand ?? productRight.name.split(' ')[0]}</Text>
            </View>
          </View>

          <View style={styles.miniScoresBlock}>
            {metrics.map((m) => (
              <View key={m.id} style={styles.miniScoreRow}>
                <Text style={styles.miniScoreLabel}>{m.label}</Text>
                <View style={styles.miniScoreRight}>
                  <View style={[styles.miniScoreDot, styles.miniScoreDotA]}>
                    <Text style={[styles.miniScoreDotText, styles.miniScoreDotTextA]}>{m.a}</Text>
                  </View>
                  <View style={[styles.miniScoreDot, styles.miniScoreDotB]}>
                    <Text style={[styles.miniScoreDotText, styles.miniScoreDotTextB]}>{m.b}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.aiSeparator} />

          <TouchableOpacity activeOpacity={0.85} style={styles.aiOverviewHeaderRow} onPress={() => setAiOverviewOpen((v) => !v)}>
            <Text style={styles.aiOverviewHeader}>AI Overview</Text>
            <Ionicons name={aiOverviewOpen ? 'chevron-up' : 'chevron-down'} size={18} color={BRAND_GREEN} />
          </TouchableOpacity>
          <Text style={styles.aiOverviewText} numberOfLines={aiOverviewOpen ? undefined : 3}>
            Based on aggregate public data and feature/value scoring, {bestBrand} {bestProduct.name} wins due to stronger performance across the most important categories, with a better price-to-feature balance.
          </Text>
        </View>

        <View style={styles.cardTight}>
          <View style={styles.bestStoreHeaderRow}>
            <Text style={styles.bestStoreTitle}>Best Store</Text>
            <Ionicons name="bookmark-outline" size={18} color="#111827" />
          </View>
          <View style={styles.bestStoreCompareRow}>
            <View style={styles.bestStoreHalf}>
              <View style={styles.bestStoreRow}>
                <View style={styles.bestStoreThumb} />
                <View style={styles.bestStoreTextCol}>
                  <View style={styles.bestStoreMetaRow}>
                    <View style={styles.bestStoreLogoCircle}>
                      <Text style={styles.bestStoreLogoText}>{getInitial(bestBrand)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bestStoreProductName} numberOfLines={1}>
                        {bestProduct.name}
                      </Text>
                      <Text style={styles.bestStoreMeta}>In-Stock</Text>
                    </View>
                    <Text style={styles.bestStorePrice}>{bestProduct.price}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.9} style={[styles.bestStoreBtn, { backgroundColor: bestColor }]}>
                    <Text style={styles.bestStoreBtnText}>Visit Store</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.bestStoreHeart} activeOpacity={0.85}>
                <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.bestStoreHalf}>
              <View style={styles.bestStoreRow}>
                <View style={styles.bestStoreThumb} />
                <View style={styles.bestStoreTextCol}>
                  <View style={styles.bestStoreMetaRow}>
                    <View style={styles.bestStoreLogoCircle}>
                      <Text style={styles.bestStoreLogoText}>{getInitial(otherBrand)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bestStoreProductName} numberOfLines={1}>
                        {otherProduct.name}
                      </Text>
                      <Text style={styles.bestStoreMeta}>In-Stock</Text>
                    </View>
                    <Text style={styles.bestStorePrice}>{otherProduct.price}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.9} style={[styles.bestStoreBtn, { backgroundColor: winner === 'A' ? ACCENT_COLOR : BRAND_GREEN }]}>
                    <Text style={styles.bestStoreBtnText}>Visit Store</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.bestStoreHeart} activeOpacity={0.85}>
                <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceHeaderCol}>
            <Text style={styles.priceHistoryTitle}>Price History</Text>
            <Text style={styles.priceGraphSubtitle}>Price graph</Text>
          </View>

          <View style={styles.rangeRowAboveChart}>
            {ranges.map((r) => (
              <TouchableOpacity
                key={r}
                activeOpacity={0.9}
                onPress={() => setRange(r)}
                style={[styles.rangeTab, r === range && styles.rangeTabActive]}
              >
                <Text style={[styles.rangeTabText, r === range && styles.rangeTabTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.priceHistoryRow}>
            <View style={styles.priceChartCol}>
              <View style={styles.chartWrapMock}>
                <View style={styles.chartWithYAxisRight}>
                  <View style={styles.chartSvgWrap}>
                    <View pointerEvents="none" style={styles.chartGridLines}>
                      <View style={styles.chartGridLine} />
                      <View style={styles.chartGridLine} />
                      <View style={styles.chartGridLine} />
                    </View>
                    <TwoLineChart aPoints={PRICE_HISTORY_POINTS[range].a} bPoints={PRICE_HISTORY_POINTS[range].b} w={140} h={92} />
                  </View>

                  <View style={styles.chartYAxisRight}>
                    {(() => {
                      const pts = PRICE_HISTORY_POINTS[range];
                      const all = [...pts.a, ...pts.b];
                      const maxRaw = Math.max(...all);
                      const minRaw = Math.min(...all);
                      const max = toNiceCeil(maxRaw, 10);
                      const min = toNiceFloor(minRaw, 10);
                      const mid = Math.round((max + min) / 2);
                      return (
                        <>
                          <Text style={styles.chartYAxisText}>{`$${max}`}</Text>
                          <Text style={styles.chartYAxisText}>{`$${mid}`}</Text>
                          <Text style={styles.chartYAxisText}>{`$${min}`}</Text>
                        </>
                      );
                    })()}
                  </View>
                </View>

                <View style={styles.chartXRowSmall}>
                  {PRICE_HISTORY_POINTS[range].xTicks.map((t) => (
                    <Text key={t} style={styles.chartAxisText}>{t}</Text>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceOverviewCol}>
              <Text style={styles.priceOverviewTitle}>Price Overview</Text>
              <View style={styles.priceOverviewRow}>
                <Text style={styles.priceOverviewLeft}>{`$${bestAvg}`}</Text>
                <Text style={styles.priceOverviewRight}>Avg</Text>
              </View>
              <View style={styles.priceOverviewRow}>
                <Text style={styles.priceOverviewLeft}>{`$${bestToday}`}</Text>
                <View style={styles.todayDot} />
                <Text style={styles.priceOverviewRight}>Today</Text>
              </View>
              <View style={styles.priceOverviewRow}>
                <Text style={styles.priceOverviewLeft}>{`$${bestLow}`}</Text>
                <Text style={styles.priceOverviewRight}>Low</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRowMock}>
          <Text style={styles.sectionTitleMockNoTop}>Other Stores</Text>
          <Ionicons name="chevron-forward" size={18} color="#111827" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent} style={styles.hScroll}>
          {otherStores.map((item) => (
            <View key={item.id} style={styles.hItem}>
              <View style={styles.gridCard}>
                <View style={styles.gridImgPlaceholder} />
                <View style={styles.savePill}>
                  <Text style={styles.savePillText}>{item.save}</Text>
                </View>
                <TouchableOpacity style={styles.heartBtn} activeOpacity={0.85}>
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
          {alternatives.map((item) => (
            <View key={item.id} style={styles.hItem}>
              <View style={styles.gridCard}>
                <View style={styles.gridImgPlaceholder} />
                <TouchableOpacity style={styles.heartBtn} activeOpacity={0.85}>
                  <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.gridMetaRow}>
                <View style={styles.storeLogoBlank} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.gridStore}>{item.price}</Text>
                  <Text style={styles.gridName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.gridPrice}>{item.note.replace('\n', ' ')}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomActions}>
          <TouchableOpacity activeOpacity={0.9} style={styles.bottomBtnSecondary}>
            <Text style={styles.bottomBtnSecondaryText}>Save Comparison</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} style={styles.bottomBtnPrimary}>
            <Text style={styles.bottomBtnPrimaryText}>View Offer</Text>
          </TouchableOpacity>
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
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    fontFamily: DEALO_FONT_FAMILY,
  },
  headerCenter: { flex: 1 },
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
  compareRowWrap: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
  },
  compareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  compareTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  compareProductBlank: { width: '100%', height: 108, borderRadius: 12, backgroundColor: '#F3F4F6', marginBottom: 12 },
  compareMetaRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  topMetaRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  logoInitial: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  brandText: { fontSize: 11, fontWeight: '800', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  productText: { fontSize: 11, fontWeight: '600', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY, marginTop: 1 },
  priceText: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, marginTop: 4 },
  priceInline: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },

  bestDealCard: { marginTop: 14, marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EEF2F7' },
  bestDealHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  bestDealTitle: { fontSize: 15, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestDealBody: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  bestDealThumb: { width: 112, height: 112, borderRadius: 16, backgroundColor: '#F3F4F6' },
  bestDealMetaRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 },
  bestDealTopRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  bestDealBrand: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestDealProduct: { fontSize: 11, fontWeight: '700', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY, marginTop: 1 },
  bestDealPriceInline: { fontSize: 18, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  logoCircleSm: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  logoInitialSm: { fontSize: 11, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestDealPrice: { fontSize: 18, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, marginBottom: 2 },
  bestDealReviews: { fontSize: 11, fontWeight: '600', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY, marginBottom: 10 },
  visitBtn: { height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  visitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', fontFamily: DEALO_FONT_FAMILY },
  overviewHeaderRow: { marginTop: 12 },
  overviewInline: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  overviewChevron: { marginLeft: 4, marginTop: 1 },
  overviewHeader: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  overviewText: { marginTop: 6, fontSize: 11, lineHeight: 16, color: '#6B7280', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },

  scoreSection: { paddingHorizontal: 16, marginTop: 14 },
  aiDealScoreTitle: { fontSize: 14, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, marginBottom: 12 },
  scoreCircleRow: { flexDirection: 'row', gap: 14, justifyContent: 'space-between', alignItems: 'center' },
  scoreCircleWrap: { flex: 1, alignItems: 'center' },
  scoreVersus: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, opacity: 0.7, marginTop: -10 },
  scoreCircle: { width: 78, height: 78, borderRadius: 39, borderWidth: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  scoreCircleNum: { fontSize: 20, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, marginTop: 2 },
  scoreCircleOut: { fontSize: 9, fontWeight: '800', color: '#9CA3AF', fontFamily: DEALO_FONT_FAMILY, marginTop: -2 },
  scoreCircleLabel: { marginTop: 8, fontSize: 11, fontWeight: '800', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  miniScoresBlock: { marginTop: 14, gap: 10 },
  miniScoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniScoreLabel: { fontSize: 11, fontWeight: '700', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  miniScoreRight: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  miniScoreDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  miniScoreDotA: { backgroundColor: 'rgba(14,159,110,0.14)' },
  miniScoreDotB: { backgroundColor: 'rgba(37,99,235,0.14)' },
  miniScoreDotWin: { backgroundColor: '#111827' },
  miniScoreDotText: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', fontFamily: DEALO_FONT_FAMILY },
  miniScoreDotTextA: { color: BRAND_GREEN, fontWeight: '900' },
  miniScoreDotTextB: { color: ACCENT_COLOR, fontWeight: '900' },
  miniScoreDotTextWin: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  aiSeparator: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginTop: 16, marginBottom: 12 },
  aiOverviewHeaderRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiOverviewHeader: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  aiOverviewText: { marginTop: 6, fontSize: 11, lineHeight: 16, color: '#6B7280', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },

  cardTight: { marginTop: 14, marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EEF2F7' },
  bestStoreHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bestStoreTitle: { fontSize: 13, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestStoreCompareRow: { flexDirection: 'row', gap: 12 },
  bestStoreHalf: { flex: 1, borderRadius: 14, backgroundColor: '#F9FAFB', padding: 12, borderWidth: 1, borderColor: '#EEF2F7', overflow: 'hidden', minHeight: 170 },
  bestStoreRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bestStoreThumb: { width: 86, height: 86, borderRadius: 14, backgroundColor: '#F3F4F6' },
  bestStoreTextCol: { flex: 1 },
  bestStoreMetaRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  bestStoreLogoCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  bestStoreLogoText: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestStoreProductName: { fontSize: 11, fontWeight: '800', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestStorePrice: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  bestStoreMeta: { fontSize: 10, fontWeight: '700', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY, marginTop: 2, marginBottom: 10 },
  bestStoreBtn: { height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bestStoreBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', fontFamily: DEALO_FONT_FAMILY },
  bestStoreHeart: { position: 'absolute', right: 10, bottom: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(17,24,39,0.55)', justifyContent: 'center', alignItems: 'center' },

  priceHistoryTitle: { fontSize: 14, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  priceSection: { marginTop: 14, paddingHorizontal: 16 },
  priceHeaderCol: { marginBottom: 10 },
  priceGraphSubtitle: { marginTop: 4, fontSize: 12, fontWeight: '800', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  rangeRowAboveChart: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  rangeRowCompact: { flexDirection: 'row', gap: 8 },
  rangeTab: { paddingHorizontal: 10, height: 26, borderRadius: 999, justifyContent: 'center', backgroundColor: '#F3F4F6' },
  rangeTabActive: { backgroundColor: '#111827' },
  rangeTabText: { fontSize: 10, fontWeight: '800', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  rangeTabTextActive: { color: '#FFFFFF' },
  priceHistoryRow: { flexDirection: 'row', alignItems: 'center' },
  priceChartCol: { flex: 1 },
  priceDivider: { width: 1, height: 120, backgroundColor: '#EEF2F7', marginHorizontal: 12 },
  priceOverviewCol: { width: 110 },
  priceOverviewTitle: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, marginBottom: 8 },
  priceOverviewRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  priceOverviewLeft: { fontSize: 12, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY, marginRight: 6 },
  priceOverviewRight: { fontSize: 10, fontWeight: '700', color: '#6B7280', fontFamily: DEALO_FONT_FAMILY },
  todayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND_GREEN, marginRight: 6 },

  chartWrapMock: { alignItems: 'stretch', marginBottom: 8 },
  chartWithYAxis: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  chartWithYAxisRight: { flexDirection: 'row', alignItems: 'center' },
  chartYAxis: { height: 92, justifyContent: 'space-between', paddingVertical: 8, marginRight: 6 },
  chartYAxisRight: { height: 92, justifyContent: 'space-between', paddingVertical: 8, marginLeft: 6 },
  chartYAxisText: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },
  chartSvgWrap: { position: 'relative' },
  chartGridLines: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingVertical: 8 },
  chartGridLine: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)' },
  chartXRow: { marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 38, paddingRight: 12 },
  chartXRowSmall: { marginTop: 2, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 6 },
  chartAxisText: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', fontFamily: DEALO_FONT_FAMILY },

  sectionHeaderRowMock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 18, marginBottom: 10 },
  sectionTitleMockNoTop: { fontSize: 16, fontWeight: '900', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  hScroll: { paddingHorizontal: 16 },
  hScrollContent: { gap: 14, paddingRight: 16 },
  hItem: { width: Math.min(180, Math.round(width * 0.46)) },
  gridCard: { borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEF2F7', padding: 12, overflow: 'hidden' },
  gridImgPlaceholder: { width: '100%', height: 110, borderRadius: 12, backgroundColor: '#F3F4F6' },
  savePill: { position: 'absolute', left: 12, top: 12, height: 22, borderRadius: 6, backgroundColor: BRAND_GREEN, paddingHorizontal: 10, justifyContent: 'center' },
  savePillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', fontFamily: DEALO_FONT_FAMILY },
  heartBtn: { position: 'absolute', right: 12, bottom: 12, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(17,24,39,0.55)', justifyContent: 'center', alignItems: 'center' },
  gridMetaRow: { marginTop: 10, flexDirection: 'row', gap: 10, alignItems: 'center' },
  gridStore: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  gridName: { fontSize: 12, fontWeight: '400', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  gridPrice: { fontSize: 12, fontWeight: '600', color: '#111827', fontFamily: DEALO_FONT_FAMILY },
  storeLogoBlank: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E5E7EB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },

  bottomActions: { paddingHorizontal: 16, marginTop: 18, marginBottom: 22, flexDirection: 'row', gap: 14 },
  bottomBtnSecondary: { flex: 1, height: 54, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  bottomBtnSecondaryText: { color: BRAND_GREEN, fontSize: 15, fontWeight: '700', fontFamily: DEALO_FONT_FAMILY },
  bottomBtnPrimary: { flex: 1, height: 54, borderRadius: 999, backgroundColor: BRAND_GREEN, justifyContent: 'center', alignItems: 'center', shadowColor: BRAND_GREEN, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.33, shadowRadius: 26, elevation: 12 },
  bottomBtnPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: DEALO_FONT_FAMILY },
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
