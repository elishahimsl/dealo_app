import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Platform, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useProductLookup } from '../../../lib/hooks/use-product-lookup';
import { useSaveToggle } from '../../../lib/hooks/use-saved-products';
import { trackInteraction } from '../../../lib/services/user-interactions';
import AdBanner from '../../../components/AdBanner';

const { width } = Dimensions.get('window');

// Dealo logo font family - using system font that matches the logo's clean sans-serif style
const DEALO_FONT_FAMILY = 'Manrope-Regular'; // This matches the clean, modern sans-serif of the Dealo logo
const BRAND_GREEN = '#0E9F6E';

type RangeKey = '90D' | '3M' | '1Y';

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

export default function CameraResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const identifyOnly = params.identifyOnly === '1';
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [aiSummaryExpanded, setAiSummaryExpanded] = useState(false);
  const [range, setRange] = useState<RangeKey>('90D');
  const half = useMemo(() => (width - 16 * 2 - 12) / 2, []);

  // Parse params
  const objectName = typeof params.objectName === 'string' ? params.objectName : '';
  const categoryParam = typeof params.category === 'string' ? params.category : 'General';
  const imageUri = (params.imageUri as string) || '';

  // Real data lookup: searches prices, stores in DB, calculates DLO score
  const { status, data: productData, dloScore, error, retry } = useProductLookup(
    objectName,
    categoryParam,
    imageUri
  );

  // Save toggle for this product
  const productId = productData?.product?.id;
  const { saved, toggling, toggle: toggleSave } = useSaveToggle(productId);

  // Track scan interaction when product data loads
  useEffect(() => {
    if (productId && status === 'done') {
      trackInteraction({ productId, type: 'scan', metadata: { source: 'camera', name: objectName } });
    }
  }, [productId, status]);

  // Derive display data from real results
  const displayName = objectName.trim() || 'Unknown Product';
  const displayImage = imageUri || productData?.priceResults?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80';
  const dealLabel = dloScore?.label || 'Analyzing...';
  const confidence = (params.confidence as string) || '0.85';
  const matchDots = Math.min(5, Math.max(1, Math.round(parseFloat(confidence) * 5)));

  // Price data
  const bestPrice = productData?.bestPrice || null;
  const avgPrice = productData?.avgPrice;
  const lowestPrice = productData?.lowestPrice;
  const highestPrice = productData?.highestPrice;
  const pricedResults = (productData?.priceResults || []).filter((r) => r.price !== null);

  // Build "Other Stores" from real price results
  const otherStores = useMemo(() => {
    if (!pricedResults.length) return [];
    return pricedResults.slice(0, 6).map((r, i) => ({
      id: `os${i}`,
      store: r.store,
      name: r.title,
      price: r.price !== null ? `$${r.price.toFixed(2)}` : 'See site',
      url: r.affiliateUrl || r.url,
      imageUrl: r.imageUrl,
      save: bestPrice && r.price && avgPrice && avgPrice > r.price
        ? `Save $${Math.round(avgPrice - r.price)}`
        : null,
    }));
  }, [pricedResults, bestPrice, avgPrice]);

  // Overview description from snippets
  const overviewDescription = useMemo(() => {
    if (pricedResults.length > 0) {
      const longestSnippet = [...pricedResults].sort((a, b) => (b.snippet?.length || 0) - (a.snippet?.length || 0))[0];
      return longestSnippet?.snippet || `${displayName} found across ${pricedResults.length} retailers.`;
    }
    return `Searching for the best deals on ${displayName}...`;
  }, [pricedResults, displayName]);

  // For backward compat with identifyOnly view
  const detectedProduct = {
    objectName: displayName,
    category: categoryParam,
    confidence,
    imageUri: displayImage,
  };

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

  // Loading state
  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRowMock}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <ActivityIndicator size="large" color={BRAND_GREEN} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Finding best deals...</Text>
          <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40 }}>
            Searching retailers for {displayName}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRowMock}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 32 }}>
          <Ionicons name="alert-circle-outline" size={48} color="#F59E0B" />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Search Failed</Text>
          <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center' }}>{error || 'Could not find price data'}</Text>
          <TouchableOpacity onPress={retry} style={{ height: 44, borderRadius: 999, backgroundColor: BRAND_GREEN, paddingHorizontal: 24, justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Derive chart data from real prices
  const chartPrices = pricedResults.map((r) => r.price!);
  const chartMax = chartPrices.length > 0 ? Math.max(...chartPrices) : 200;
  const chartMin = chartPrices.length > 0 ? Math.min(...chartPrices) : 100;
  const chartMid = Math.round((chartMax + chartMin) / 2);

  // Build review rows from DLO breakdown
  const reviewRows = (dloScore?.breakdown || []).map((b) => ({
    k: b.label,
    v: b.value >= 85 ? 'Very Positive' : b.value >= 75 ? 'Positive' : b.value >= 65 ? 'Fair' : 'Mixed',
    tone: (b.value >= 70 ? 'good' : 'warn') as 'good' | 'warn',
  }));

  // Best price discount
  const bestDiscount = bestPrice && avgPrice && avgPrice > bestPrice.price!
    ? `${Math.round(((avgPrice - bestPrice.price!) / avgPrice) * 100)}% Off`
    : null;

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
              <Image source={{ uri: displayImage }} style={styles.heroImageMock} />
            </View>
            <View style={styles.heroRight}>
              <Text style={styles.heroTitleMock}>{displayName}</Text>
              <View style={styles.goodDealPill}>
                <Text style={styles.goodDealText}>{dealLabel}</Text>
              </View>

              <Text style={styles.productMatchLabel}>Product Match</Text>
              <View style={styles.matchDotsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View key={i} style={[styles.matchDot, i < matchDots ? styles.matchDotOn : styles.matchDotOff]} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.hrMock} />

          <Text style={styles.sectionTitleMock}>Product Overview</Text>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewText}>{overviewDescription}</Text>
            <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} style={{ marginTop: 2 }} />
          </View>
          {pricedResults.length > 0 && (
            <View style={styles.overviewTagsRow}>
              <Text style={styles.overviewTagsText}>
                {[
                  categoryParam,
                  pricedResults.length > 0 ? `${pricedResults.length} Stores` : null,
                  bestPrice?.price ? `From $${bestPrice.price.toFixed(2)}` : null,
                ].filter(Boolean).join('   •   ')}
              </Text>
            </View>
          )}

          {dloScore && dloScore.breakdown.length > 0 && (
            <>
              <View style={styles.strengthCard}>
                <View pointerEvents="none" style={styles.strengthTint} />
                <Text style={styles.cardHeader}>Strengths</Text>
                <View style={styles.bulletList}>
                  {dloScore.breakdown.filter((b) => b.value >= 75).slice(0, 3).map((b, i) => (
                    <View key={i} style={styles.bulletRowMock}>
                      <View style={[styles.bulletDotMock, { backgroundColor: BRAND_GREEN }]} />
                      <Text style={styles.bulletTextMock}>{`Strong ${b.label.toLowerCase()} score of ${b.value} — above average for this category`}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.weakCardWrap}>
                <View pointerEvents="none" style={styles.weakUnderlay} />
                <View style={styles.weakCard}>
                  <View pointerEvents="none" style={styles.weakTint} />
                  <Text style={styles.cardHeader}>Areas to Watch</Text>
                  <View style={styles.bulletList}>
                    {dloScore.breakdown.filter((b) => b.value < 75).slice(0, 3).map((b, i) => (
                      <View key={i} style={styles.bulletRowMock}>
                        <View style={[styles.bulletDotMock, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.bulletTextMock}>{`${b.label} scored ${b.value} — consider comparing alternatives`}</Text>
                      </View>
                    ))}
                    {dloScore.breakdown.filter((b) => b.value < 75).length === 0 && (
                      <View style={styles.bulletRowMock}>
                        <View style={[styles.bulletDotMock, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.bulletTextMock}>No major concerns detected for this product</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}

          <Text style={styles.sectionTitleMock}>Deal Overview</Text>
          <View style={styles.aiScoreWrap}>
            <Text style={styles.aiScoreTitle}>
              AI Score <Text style={styles.aiScoreValue}>{dloScore?.overallScore || '--'}</Text> {dealLabel}
            </Text>
            <View style={styles.aiTrack}>
              <View style={[styles.aiFill, { width: `${dloScore?.overallScore || 0}%` }]} />
            </View>
            <View style={styles.aiBreakRow}>
              {(dloScore?.breakdown || []).map((b) => (
                <View key={b.key} style={styles.aiBreakItem}>
                  <View style={styles.aiDot} />
                  <Text style={styles.aiBreakText}>
                    {b.label} <Text style={styles.aiBreakNum}>{b.value}</Text>
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.aiRundownTitle}>AI Rundown</Text>
            <View style={styles.aiRundownRow}>
              <Text style={styles.aiRundownText}>{dloScore?.rundown || 'Analyzing product data...'}</Text>
              <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} />
            </View>
          </View>

          {bestPrice && (
            <View style={styles.bestPriceGlass}>
              <View style={styles.bestPriceHeaderRow}>
                <Text style={styles.bestPriceTitle}>Best Price</Text>
                <Ionicons name="bookmark-outline" size={20} color="#111827" />
              </View>
              <View style={styles.bestPriceBody}>
                <View style={styles.bestPriceThumbWrap}>
                  <Image source={{ uri: bestPrice.imageUrl || displayImage }} style={styles.bestPriceThumb} />
                  {bestDiscount && (
                    <View style={styles.discountPill}>
                      <Text style={styles.discountText}>{bestDiscount}</Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.bestStoreRow}>
                    <View style={[styles.storeLogoCircle, { backgroundColor: BRAND_GREEN }]}>
                      <Text style={styles.storeLogoText}>{bestPrice.store.charAt(0)}</Text>
                    </View>
                    <Text style={styles.bestStoreName}>{bestPrice.store}</Text>
                  </View>
                  <Text style={styles.bestSubtitle}>{bestPrice.title}</Text>
                  <Text style={styles.bestPriceValue}>${bestPrice.price!.toFixed(2)}</Text>
                  <Text style={styles.bestStock}>Available</Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.visitBtnMock}
                    onPress={() => Linking.openURL(bestPrice.affiliateUrl || bestPrice.url)}
                  >
                    <Text style={styles.visitTextMock}>Visit Store</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {pricedResults.length > 0 && (
            <>
              <Text style={styles.sectionTitleMock}>Market Price</Text>
              <View style={styles.marketRow}>
                <View style={styles.marketLeftCard}>
                  <View style={styles.chartWrapMock}>
                    <View style={styles.chartWithYAxis}>
                      <View style={styles.chartYAxis}>
                        <Text style={styles.chartYAxisText}>{`$${chartMax}`}</Text>
                        <Text style={styles.chartYAxisText}>{`$${chartMid}`}</Text>
                        <Text style={styles.chartYAxisText}>{`$${chartMin}`}</Text>
                      </View>
                      <View style={styles.chartSvgWrap}>
                        <MarketChart points={chartPrices.length >= 2 ? chartPrices : [chartMax, chartMid, chartMin]} />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.marketDivider} />
                <View style={styles.marketRightCard}>
                  <Text style={styles.priceOverviewTitle}>Price Overview</Text>
                  <View style={styles.priceOverviewRow}>
                    <Text style={styles.priceOverviewLeft}>${avgPrice?.toFixed(2) || '--'}</Text>
                    <Text style={styles.priceOverviewRight}>Avg</Text>
                  </View>
                  <View style={styles.priceOverviewRow}>
                    <Text style={styles.priceOverviewLeft}>${lowestPrice?.toFixed(2) || '--'}</Text>
                    <View style={styles.todayDot} />
                    <Text style={styles.priceOverviewRight}>Best</Text>
                  </View>
                  <View style={styles.priceOverviewRow}>
                    <Text style={styles.priceOverviewLeft}>${highestPrice?.toFixed(2) || '--'}</Text>
                    <Text style={styles.priceOverviewRight}>High</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {reviewRows.length > 0 && (
            <View style={styles.reviewsGlass}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.reviewsTitle}>Score Breakdown</Text>
              </View>
              {reviewRows.map((r, i) => (
                <View key={r.k} style={[styles.reviewRow, i !== reviewRows.length - 1 && styles.reviewRowBorder]}>
                  <Text style={[styles.reviewKey, i === 0 && styles.reviewKeyBold]}>{r.k}</Text>
                  <Text style={[styles.reviewVal, r.tone === 'warn' ? styles.reviewValWarn : styles.reviewValGood]}>{r.v}</Text>
                </View>
              ))}
            </View>
          )}

          {dloScore?.rundown && (
            <View style={styles.reviewOverviewSection}>
              <Text style={styles.reviewOverviewHeader}>AI Analysis</Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.reviewOverviewRow}>
                <Text style={styles.reviewOverviewTextInline}>{dloScore.rundown}</Text>
                <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} style={styles.reviewOverviewChevron} />
              </TouchableOpacity>
            </View>
          )}

          {otherStores.length > 0 && (
            <>
              <View style={styles.sectionHeaderRowMock}>
                <Text style={styles.sectionTitleMockNoTop}>All Retailers ({otherStores.length})</Text>
                <Ionicons name="chevron-forward" size={18} color="#111827" />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent} style={styles.hScroll}>
                {otherStores.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.hItem} onPress={() => Linking.openURL(item.url)} activeOpacity={0.85}>
                    <View style={styles.gridCard}>
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={[styles.gridImgPlaceholder, { resizeMode: 'contain' }]} />
                      ) : (
                        <View style={styles.gridImgPlaceholder} />
                      )}
                      {item.save && (
                        <View style={styles.savePill}>
                          <Text style={styles.savePillText}>{item.save}</Text>
                        </View>
                      )}
                      <TouchableOpacity style={styles.heartBtn}>
                        <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.gridMetaRow}>
                      <View style={[styles.storeLogoCircle, { backgroundColor: BRAND_GREEN, width: 34, height: 34, borderRadius: 17 }]}>
                        <Text style={[styles.storeLogoText, { fontSize: 14 }]}>{item.store.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.gridStore}>{item.store}</Text>
                        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.gridPrice}>{item.price}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <View style={styles.offRow}>
            <Text style={styles.offText}>Something seem off?</Text>
            <Text style={styles.offLink}> Let us know</Text>
          </View>

          <AdBanner style={{ marginHorizontal: 16, marginVertical: 8 }} />

          <View style={styles.bottomActionsInFlow}>
            <TouchableOpacity activeOpacity={0.9} style={styles.bottomBtnSecondary} onPress={toggleSave} disabled={toggling || !productId}>
              <Text style={styles.bottomBtnSecondaryText}>{saved ? '♥ Saved' : 'Save for Later'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.bottomBtnPrimary}
              onPress={() => {
                const url = bestPrice?.affiliateUrl || bestPrice?.url;
                if (url) Linking.openURL(url);
              }}
            >
              <Text style={styles.bottomBtnPrimaryText}>{bestPrice ? 'View Offer' : 'Scan Again'}</Text>
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
