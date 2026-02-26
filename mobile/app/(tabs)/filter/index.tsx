import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#0E9F6E';

type Range = {
  min: number;
  max: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMoney(n: number) {
  return `$${n.toLocaleString()}`;
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

function OptionRow({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.sortRow}>
      <View style={[styles.radioOuter, active ? styles.radioOuterActive : null]}>
        {active ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={styles.sortText}>{label}</Text>
    </TouchableOpacity>
  );
}

function DualThumbRange({ min, max, value, onChange }: { min: number; max: number; value: Range; onChange: (r: Range) => void }) {
  const trackW = Math.min(320, Math.round(width - 48));
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  const pctMin = (value.min - min) / (max - min);
  const pctMax = (value.max - min) / (max - min);

  const xMin = clamp(Math.round(pctMin * trackW), 0, trackW);
  const xMax = clamp(Math.round(pctMax * trackW), 0, trackW);

  const moveBy = (dx: number) => {
    if (!dragging) return;

    const nextX = dragging === 'min' ? xMin + dx : xMax + dx;
    const nextPct = clamp(nextX / trackW, 0, 1);
    const raw = Math.round(min + nextPct * (max - min));
    const snapped = Math.round(raw / 10) * 10;

    if (dragging === 'min') {
      onChange({ min: Math.min(snapped, value.max - 10), max: value.max });
    } else {
      onChange({ min: value.min, max: Math.max(snapped, value.min + 10) });
    }
  };

  return (
    <View style={{ width: trackW }}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderActive, { left: Math.min(xMin, xMax), width: Math.max(0, Math.abs(xMax - xMin)) }]} />
      </View>

      <View pointerEvents="box-none" style={[styles.sliderThumbLayer, { width: trackW }]}>
        <Pressable
          onPressIn={() => setDragging('min')}
          onPressOut={() => setDragging(null)}
          onTouchMove={(e) => {
            moveBy(e.nativeEvent.locationX - xMin);
          }}
          style={[styles.sliderThumbHit, { left: xMin - 18 }]}
        >
          <View style={styles.sliderThumb} />
        </Pressable>

        <Pressable
          onPressIn={() => setDragging('max')}
          onPressOut={() => setDragging(null)}
          onTouchMove={(e) => {
            moveBy(e.nativeEvent.locationX - xMax);
          }}
          style={[styles.sliderThumbHit, { left: xMax - 18 }]}
        >
          <View style={styles.sliderThumb} />
        </Pressable>
      </View>
    </View>
  );
}

export default function FilterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = (params.returnTo ?? '').toString().trim();

  const translateY = useRef(new Animated.Value(540)).current;
  const dragYStart = useRef(0);

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: 560,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (returnTo) router.replace(returnTo as Href);
      else router.back();
    });
  };

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 190,
      mass: 0.95,
    }).start();
  }, [translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dy) > 6 && Math.abs(gesture.dx) < 18,
        onPanResponderGrant: () => {
          translateY.stopAnimation((v) => {
            dragYStart.current = v;
          });
        },
        onPanResponderMove: (_evt, gesture) => {
          const next = Math.max(0, dragYStart.current + gesture.dy);
          translateY.setValue(next);
        },
        onPanResponderRelease: (_evt, gesture) => {
          if (gesture.dy > 120 || gesture.vy > 1.1) {
            dismiss();
            return;
          }
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 220,
            mass: 0.95,
          }).start();
        },
      }),
    [translateY]
  );

  const [sortBy, setSortBy] = useState('Best Match');
  const [price, setPrice] = useState<Range>({ min: 50, max: 250 });
  const [activeQuickPrice, setActiveQuickPrice] = useState('Under $200');
  const [activeStores, setActiveStores] = useState<Record<string, boolean>>({ Target: true, 'Best Buy': true });
  const [activeBrands, setActiveBrands] = useState<Record<string, boolean>>({ Apple: true });

  const sortOptions = useMemo(() => ['Best Match', 'Lowest Price', 'Highest Rating', 'Biggest Discount'], []);
  const quickPriceOptions = useMemo(() => ['Any', 'Under $50', 'Under $100', 'Under $200'], []);

  const stores = useMemo(
    () => [
      { id: 'amazon', label: 'Amazon', domain: 'amazon.com' },
      { id: 'target', label: 'Target', domain: 'target.com' },
      { id: 'bestbuy', label: 'Best Buy', domain: 'bestbuy.com' },
      { id: 'walmart', label: 'Walmart', domain: 'walmart.com' },
      { id: 'costco', label: 'Costco', domain: 'costco.com' },
    ],
    []
  );

  const brands = useMemo(
    () => [
      { id: 'apple', label: 'Apple', domain: 'apple.com' },
      { id: 'sony', label: 'Sony', domain: 'sony.com' },
      { id: 'nike', label: 'Nike', domain: 'nike.com' },
      { id: 'adidas', label: 'Adidas', domain: 'adidas.com' },
    ],
    []
  );

  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const reset = () => {
    setSortBy('Best Match');
    setPrice({ min: 50, max: 250 });
    setActiveQuickPrice('Any');
    setActiveStores({});
    setActiveBrands({});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <Pressable style={styles.backdrop} onPress={dismiss} />

      <Animated.View style={[styles.sheetWrap, { transform: [{ translateY }] }]}>
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
          <Text style={styles.headerTitle}>Filter</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SORT BY</Text>
            <View style={styles.sortCard}>
              {sortOptions.map((option, idx) => (
                <View key={option} style={idx !== 0 ? styles.rowTopDivider : undefined}>
                  <OptionRow label={option} active={sortBy === option} onPress={() => setSortBy(option)} />
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, styles.sectionGap]}>PRICE RANGE</Text>
            <Text style={styles.priceHeadline}>{formatMoney(price.min)} - {formatMoney(price.max)}</Text>
            <View style={styles.sliderWrap}>
              <DualThumbRange min={0} max={250} value={price} onChange={setPrice} />
            </View>
            <View style={styles.priceBoundsRow}>
              <Text style={styles.boundText}>$50</Text>
              <Text style={styles.boundText}>$250</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPriceRow}>
              {quickPriceOptions.map((option) => (
                <FilterChip key={option} label={option} active={activeQuickPrice === option} onPress={() => setActiveQuickPrice(option)} />
              ))}
              <TouchableOpacity activeOpacity={0.85} style={styles.chipArrowBtn}>
                <Ionicons name="chevron-forward" size={18} color="#6B7280" />
              </TouchableOpacity>
            </ScrollView>

            <Text style={[styles.sectionLabel, styles.sectionGap]}>STORES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logoRow}>
              {stores.map((store) => {
                const active = !!activeStores[store.label];
                return (
                  <TouchableOpacity
                    key={store.id}
                    activeOpacity={0.9}
                    style={[styles.logoChip, active && styles.logoChipActive]}
                    onPress={() => setActiveStores((prev) => ({ ...prev, [store.label]: !prev[store.label] }))}
                  >
                    {!logoErrors[store.id] ? (
                      <Image
                        source={{ uri: `https://logo.clearbit.com/${store.domain}` }}
                        style={styles.logoImage}
                        onError={() => setLogoErrors((prev) => ({ ...prev, [store.id]: true }))}
                      />
                    ) : (
                      <Text style={styles.logoFallback}>{store.label}</Text>
                    )}
                    {active ? (
                      <View style={styles.checkPill}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionLabel, styles.sectionGap]}>BRANDS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
              {brands.map((brand) => (
                <FilterChip
                  key={`b1-${brand.id}`}
                  label={brand.label}
                  active={!!activeBrands[brand.label]}
                  onPress={() => setActiveBrands((prev) => ({ ...prev, [brand.label]: !prev[brand.label] }))}
                />
              ))}
            </ScrollView>

            <Text style={[styles.sectionLabel, styles.sectionGapTight]}>BRANDS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
              {brands.map((brand) => (
                <FilterChip
                  key={`b2-${brand.id}`}
                  label={brand.label}
                  active={!!activeBrands[brand.label]}
                  onPress={() => setActiveBrands((prev) => ({ ...prev, [brand.label]: !prev[brand.label] }))}
                />
              ))}
            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity activeOpacity={0.9} style={styles.footerBtnSecondary} onPress={reset}>
                <Text style={styles.footerBtnSecondaryText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={styles.footerBtnPrimary} onPress={dismiss}>
                <Text style={styles.footerBtnPrimaryText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.3)',
  },
  sheetWrap: {
    maxHeight: '88%',
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 60,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
    marginBottom: 10,
  },
  sheetContent: {
    paddingHorizontal: 12,
    paddingBottom: Platform.select({ ios: 26, android: 20, default: 20 }),
  },
  headerTitle: {
    fontSize: 40 / 2,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#F2F3F5',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    opacity: 0.72,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  sectionGap: {
    marginTop: 12,
  },
  sectionGapTight: {
    marginTop: 10,
  },
  sortCard: {
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    overflow: 'hidden',
  },
  rowTopDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(17,24,39,0.06)',
  },
  sortRow: {
    minHeight: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sortText: {
    fontSize: 32 / 2,
    color: '#1F2937',
    fontWeight: '500',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.6,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioOuterActive: {
    borderColor: '#D3A977',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D3A977',
  },
  priceHeadline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  sliderWrap: {
    alignItems: 'center',
  },
  priceBoundsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  boundText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  quickPriceRow: {
    paddingTop: 10,
    gap: 8,
    alignItems: 'center',
  },
  chipArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(14,159,110,0.24)',
  },
  sliderActive: {
    position: 'absolute',
    top: 0,
    height: 6,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
  },
  sliderThumbLayer: {
    position: 'absolute',
    top: -18,
    height: 40,
  },
  sliderThumbHit: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
  },
  logoRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 2,
  },
  brandRow: {
    flexDirection: 'row',
    gap: 8,
  },
  logoChip: {
    minWidth: 98,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  logoChipActive: {
    borderColor: 'rgba(14,159,110,0.5)',
    backgroundColor: 'rgba(14,159,110,0.08)',
  },
  logoImage: {
    width: '85%',
    height: '58%',
    resizeMode: 'contain',
  },
  logoFallback: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  checkPill: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BRAND_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.09)',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(14,159,110,0.62)',
    borderColor: 'rgba(14,159,110,0.75)',
  },
  chipText: {
    fontSize: 26 / 2,
    fontWeight: '600',
    color: '#111827',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 12,
  },
  footerBtnSecondary: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  footerBtnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  footerBtnPrimary: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(14,159,110,0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  footerBtnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
