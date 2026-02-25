// app/(tabs)/compare/index.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Alert, Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { fetchAllProducts, DiscoveryProduct } from '../../../lib/services/discovery-service';

const BRAND_GREEN = '#0E9F6E';

type QuickTileKey = 'discover' | 'popular' | 'saved';

const HOWTO_PAGES = 4;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_SIDE = 18;
const PAGE_WIDTH = SCREEN_WIDTH - PAGE_SIDE * 2;

function SoftCardGlow({ gradientId }: { gradientId: string }) {
  return (
    <Svg pointerEvents="none" height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D7F0F6" stopOpacity={0.9} />
          <Stop offset="0.45" stopColor="#BFEDE0" stopOpacity={0.35} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}

export default function Compare() {
  const router = useRouter();

  const howToRef = useRef<ScrollView | null>(null);
  const [howToIndex, setHowToIndex] = useState(0);

  type ProductSuggestion = {
    id: string;
    title: string;
    image: string;
  };

  const MOCK_SUGGESTIONS: ProductSuggestion[] = [
    { id: 's1', title: 'Adidas®\nShort sleeve t-shirt', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80' },
    { id: 's2', title: 'Nike®\nCrew neck tee', image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=80' },
    { id: 's3', title: 'Uniqlo®\nAirism tee', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
    { id: 's4', title: 'Polo Ralph Lauren®\nButton down', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1000&q=80' },
    { id: 's5', title: 'Banana Republic®\nOxford shirt', image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=1000&q=80' },
    { id: 's6', title: 'J.Crew®\nSlim button-down', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80' },
  ];

  const [selectSuggestions, setSelectSuggestions] = useState<ProductSuggestion[]>(MOCK_SUGGESTIONS);

  // Fetch real products from Supabase on focus, fall back to mocks
  useFocusEffect(
    useCallback(() => {
      let active = true;
      fetchAllProducts(12).then((products) => {
        if (!active || products.length === 0) return;
        setSelectSuggestions(
          products.map((p) => ({
            id: p.id,
            title: `${p.store}\n${p.name}`,
            image: p.image || MOCK_SUGGESTIONS[0].image,
          }))
        );
      });
      return () => { active = false; };
    }, [])
  );

  const [intentShown, setIntentShown] = useState(false);
  const plusRefA = useRef<View | null>(null);
  const plusRefB = useRef<View | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [actionMenuTarget, setActionMenuTarget] = useState<'A' | 'B' | null>(null);
  const [actionMenuPos, setActionMenuPos] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [selectedA, setSelectedA] = useState<ProductSuggestion | null>(null);
  const [selectedB, setSelectedB] = useState<ProductSuggestion | null>(null);
  const [selectTileHeight, setSelectTileHeight] = useState(0);
  const checkAnimA = useRef(new Animated.Value(0)).current;
  const checkAnimB = useRef(new Animated.Value(0)).current;

  const splitTitle = (t: string) => {
    const parts = t.split('\n');
    const brand = (parts[0] ?? '').trim();
    const product = (parts[1] ?? '').trim();
    return { brand, product };
  };

  const playCheck = (anim: Animated.Value) => {
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    const t = setTimeout(() => {
      howToRef.current?.scrollTo({ x: 4, animated: true });

      setTimeout(() => {
        howToRef.current?.scrollTo({ x: 0, animated: true });
      }, 320);
    }, 540);

    return () => clearTimeout(t);
  }, []);

  const onPressSearch = () => router.push('/(tabs)/search' as Href);

  const onPressSaveForLater = () => onPressQuickTile('saved');
  const onPressViewOffer = () => router.push('/compare/results' as Href);

  const openActionMenu = (target: 'A' | 'B') => {
    const ref = target === 'A' ? plusRefA.current : plusRefB.current;
    if (!ref || typeof (ref as any).measureInWindow !== 'function') {
      setActionMenuTarget(target);
      setActionMenuPos({ x: 16, y: 120, w: 0, h: 0 });
      setActionMenuOpen(true);
      return;
    }

    (ref as any).measureInWindow((x: number, y: number, w: number, h: number) => {
      setActionMenuTarget(target);
      setActionMenuPos({ x, y, w, h });
      setActionMenuOpen(true);
    });
  };

  const closeActionMenu = () => {
    setActionMenuOpen(false);
    setActionMenuTarget(null);
    setActionMenuPos(null);
  };

  const setPicked = (target: 'A' | 'B', item: ProductSuggestion) => {
    setIntentShown(true);
    if (target === 'A') {
      setSelectedA(item);
      playCheck(checkAnimA);
      return;
    }
    setSelectedB(item);
    playCheck(checkAnimB);
  };

  const pickFromPhotos = async (target: 'A' | 'B') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Photos permission required', 'Please allow photo library access to pick an image.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsMultipleSelection: false,
    });

    if (res.canceled) return;
    const asset = res.assets?.[0];
    if (!asset?.uri) return;

    const picked: ProductSuggestion = {
      id: `photo-${Date.now()}`,
      title: 'Photo\nSelected product',
      image: asset.uri,
    };
    setPicked(target, picked);
  };

  const onPressQuickTile = (key: QuickTileKey) => {
    if (key === 'discover') {
      router.push({ pathname: '/compare/discoverProducts', params: { returnTo: '/(tabs)/compare' } } as unknown as Href);
      return;
    }

    if (key === 'popular') {
      router.push('/compare/popularComparisons' as Href);
      return;
    }

    if (key === 'saved') {
      router.push('/compare/savedComparisons' as Href);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Svg pointerEvents="none" height="100%" width="100%" style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}>
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Compare</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.searchBar} onPress={onPressSearch} activeOpacity={0.85}>
            <Ionicons name="search" size={17} color="#6B7280" style={styles.searchIcon} />
            <TextInput placeholder="Search" placeholderTextColor="#6B7280" style={styles.searchInput} editable={false} pointerEvents="none" />
          </TouchableOpacity>

          <ScrollView horizontal style={styles.quickTilesScroll} contentContainerStyle={styles.quickTilesContent} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.quickTile} activeOpacity={0.9} onPress={() => onPressQuickTile('discover')}>
              <Ionicons name="search" size={17} color={BRAND_GREEN} />

              <View style={styles.quickTileTextWrap}>
                <Text style={styles.quickTileTitle}>Discover</Text>
                <Text style={styles.quickTileSubtitle}>Products</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickTile} activeOpacity={0.9} onPress={() => onPressQuickTile('popular')}>
              <Ionicons name="person-outline" size={17} color={BRAND_GREEN} />
              <View style={styles.quickTileTextWrap}>
                <Text style={styles.quickTileTitle}>Popular</Text>
                <Text style={styles.quickTileSubtitle}>Comparisons</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickTile, styles.quickTilePeek]} activeOpacity={0.9} onPress={() => onPressQuickTile('saved')}>
              <Ionicons name="bookmark-outline" size={17} color={BRAND_GREEN} />
              <View style={styles.quickTileTextWrap}>
                <Text style={styles.quickTileTitle}>Saved</Text>
                <Text style={styles.quickTileSubtitle}>Comparisons</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>

          <ScrollView
            ref={(r) => {
              howToRef.current = r;
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.howToCarouselContent}
            snapToInterval={PAGE_WIDTH + 14}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const next = Math.round(e.nativeEvent.contentOffset.x / (PAGE_WIDTH + 14));
              setHowToIndex(Math.max(0, Math.min(HOWTO_PAGES - 1, next)));
            }}
          >
            {Array.from({ length: HOWTO_PAGES }).map((_, idx) => (
              <View key={`howto-${idx}`} style={[styles.howToPage, { width: PAGE_WIDTH, marginRight: idx === HOWTO_PAGES - 1 ? 0 : 14 }]}>
                <View style={styles.howToCard}>
                  <View style={styles.howToLeft}>
                    <Text style={styles.howToTitle}>How to Compare</Text>
                    <Text style={styles.howToSubtitle}>Find your best buy</Text>
                  </View>
                  <View style={styles.howToArt}>
                    <View style={styles.howToBar1} />
                    <View style={styles.howToBar2} />
                    <View style={styles.howToBar3} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.exploreIndicatorRow}>
            {Array.from({ length: HOWTO_PAGES }).map((_, idx) => (
              <View key={`howto-ind-${idx}`} style={idx === howToIndex ? styles.exploreIndicatorActive : styles.exploreIndicatorDot} />
            ))}
          </View>

          <View style={styles.selectChecklistCard}>
            <View style={styles.selectChecklistHeader}>
              <Text style={styles.selectChecklistTitle}>Select Products</Text>
            </View>

            <View style={[styles.selectBigCard, styles.selectBigCardEmbedded]}>
              <View style={[styles.selectTile, styles.selectHalfLeft]}>
                <View
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                  onLayout={(e) => {
                    const h = Math.round(e.nativeEvent.layout.height);
                    if (!h) return;
                    setSelectTileHeight((prev) => (prev ? prev : h));
                  }}
                />

                {selectedA ? (
                  <View style={styles.selectedFill}>
                    {selectedA.image ? <Image source={{ uri: selectedA.image }} style={styles.selectedImage} /> : <View style={styles.selectedImagePlaceholder} />}
                    <Animated.View
                      style={[
                        styles.checkOverlay,
                        {
                          opacity: checkAnimA,
                          transform: [
                            {
                              scale: checkAnimA.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Ionicons name="checkmark-circle" size={40} color={BRAND_GREEN} />
                    </Animated.View>
                    <View style={styles.selectedMetaWrap}>
                      <Text style={styles.selectedBrand} numberOfLines={1}>
                        {splitTitle(selectedA.title).brand}
                      </Text>
                      <Text style={styles.selectedProduct} numberOfLines={1}>
                        {splitTitle(selectedA.title).product}
                      </Text>
                    </View>
                  </View>
                ) : intentShown ? (
                  <ScrollView
                    style={styles.suggestionPager}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={selectTileHeight || 160}
                    decelerationRate="fast"
                  >
                    {selectSuggestions.map((s) => {
                      const { brand, product } = splitTitle(s.title);
                      return (
                        <TouchableOpacity
                          key={`a-${s.id}`}
                          style={[styles.suggestionPage, { height: selectTileHeight || 160 }]}
                          activeOpacity={0.9}
                          onPress={() => setPicked('A', s)}
                        >
                          {s.image ? <Image source={{ uri: s.image }} style={styles.suggestionImage} /> : <View style={styles.suggestionImagePlaceholder} />}
                          <View style={styles.suggestionMetaWrap}>
                            <Text style={styles.suggestionBrand} numberOfLines={1}>
                              {brand}
                            </Text>
                            <Text style={styles.suggestionProduct} numberOfLines={1}>
                              {product}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : null}

                {selectedA ? (
                  <TouchableOpacity style={styles.selectRemoveWrap} activeOpacity={0.85} onPress={() => setSelectedA(null)}>
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <View collapsable={false} ref={(r) => { plusRefA.current = r; }}>
                    <TouchableOpacity style={styles.selectPlusWrap} activeOpacity={0.85} onPress={() => openActionMenu('A')}>
                      <Ionicons name="add" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.selectDivider}>
                <View style={styles.selectDividerLine} />
              </View>

              <View style={[styles.selectTile, styles.selectHalfRight]}>
                <View
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                  onLayout={(e) => {
                    const h = Math.round(e.nativeEvent.layout.height);
                    if (!h) return;
                    setSelectTileHeight((prev) => (prev ? prev : h));
                  }}
                />

                {selectedB ? (
                  <View style={styles.selectedFill}>
                    {selectedB.image ? <Image source={{ uri: selectedB.image }} style={styles.selectedImage} /> : <View style={styles.selectedImagePlaceholder} />}
                    <Animated.View
                      style={[
                        styles.checkOverlay,
                        {
                          opacity: checkAnimB,
                          transform: [
                            {
                              scale: checkAnimB.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Ionicons name="checkmark-circle" size={40} color={BRAND_GREEN} />
                    </Animated.View>
                    <View style={styles.selectedMetaWrap}>
                      <Text style={styles.selectedBrand} numberOfLines={1}>
                        {splitTitle(selectedB.title).brand}
                      </Text>
                      <Text style={styles.selectedProduct} numberOfLines={1}>
                        {splitTitle(selectedB.title).product}
                      </Text>
                    </View>
                  </View>
                ) : intentShown ? (
                  <ScrollView
                    style={styles.suggestionPager}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={selectTileHeight || 160}
                    decelerationRate="fast"
                  >
                    {selectSuggestions.map((s) => {
                      const { brand, product } = splitTitle(s.title);
                      return (
                        <TouchableOpacity
                          key={`b-${s.id}`}
                          style={[styles.suggestionPage, { height: selectTileHeight || 160 }]}
                          activeOpacity={0.9}
                          onPress={() => setPicked('B', s)}
                        >
                          {s.image ? <Image source={{ uri: s.image }} style={styles.suggestionImage} /> : <View style={styles.suggestionImagePlaceholder} />}
                          <View style={styles.suggestionMetaWrap}>
                            <Text style={styles.suggestionBrand} numberOfLines={1}>
                              {brand}
                            </Text>
                            <Text style={styles.suggestionProduct} numberOfLines={1}>
                              {product}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : null}

                {selectedB ? (
                  <TouchableOpacity style={styles.selectRemoveWrap} activeOpacity={0.85} onPress={() => setSelectedB(null)}>
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <View collapsable={false} ref={(r) => { plusRefB.current = r; }}>
                    <TouchableOpacity style={styles.selectPlusWrap} activeOpacity={0.85} onPress={() => openActionMenu('B')}>
                      <Ionicons name="add" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.selectChecklistDivider} />

            <View style={styles.actionRowEmbedded}>
              <TouchableOpacity style={styles.saveOutlineButton} activeOpacity={0.9} onPress={onPressSaveForLater}>
                <Text style={styles.saveOutlineText}>Save for Later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewOfferButton} activeOpacity={0.9} onPress={onPressViewOffer}>
                <Text style={styles.viewOfferText}>View Offer</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      <Modal transparent visible={actionMenuOpen} animationType="fade" onRequestClose={closeActionMenu}>
        <View style={styles.actionMenuOverlay}>
          <TouchableOpacity style={styles.actionMenuBackdrop} activeOpacity={1} onPress={closeActionMenu} />
          <View
            style={[
              styles.actionMenuCard,
              actionMenuPos
                ? {
                    left: Math.min(actionMenuPos.x, SCREEN_WIDTH - 210 - 16),
                    top: actionMenuPos.y + actionMenuPos.h + 8,
                  }
                : { left: 16, top: 120 },
            ]}
          >
            <TouchableOpacity
              style={styles.actionMenuRow}
              activeOpacity={0.85}
              onPress={() => {
                closeActionMenu();
                router.push('/(tabs)/camera' as Href);
              }}
            >
              <Ionicons name="camera-outline" size={18} color={BRAND_GREEN} />
              <Text style={styles.actionMenuText}>Take a picture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuRow}
              activeOpacity={0.85}
              onPress={() => {
                const t = actionMenuTarget;
                closeActionMenu();
                if (t) pickFromPhotos(t);
              }}
            >
              <Ionicons name="image-outline" size={18} color={BRAND_GREEN} />
              <Text style={styles.actionMenuText}>Grab from photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuRow}
              activeOpacity={0.85}
              onPress={() => {
                const t = actionMenuTarget;
                closeActionMenu();
                setIntentShown(true);
                if (t === 'A') setSelectedA(null);
                if (t === 'B') setSelectedB(null);
              }}
            >
              <Ionicons name="sparkles-outline" size={18} color={BRAND_GREEN} />
              <Text style={styles.actionMenuText}>Suggestions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },

  content: {
    flex: 1,
    zIndex: 1,
  },

  header: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Bold',
  },

  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
    paddingTop: 2,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.78)',
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 18,
    marginBottom: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  quickTilesScroll: {
    marginBottom: 26,
  },
  quickTilesContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  quickTilesRow: {
    marginHorizontal: 18,
    flexDirection: 'row',
    marginBottom: 18,
  },
  quickTileHalf: {
    flex: 1,
    height: 116,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    padding: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 10,
  },
  quickTileHalfLeft: {
    marginRight: 16,
  },
  quickTileHalfRight: {
    marginLeft: 0,
  },
  quickTile: {
    width: 200,
    height: 132,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    overflow: 'hidden',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  quickTilePeek: {
    marginRight: 0,
  },
  quickTileTextWrap: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    right: 10,
  },
  quickTileTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 18,
    fontFamily: 'Manrope-Bold',
  },
  quickTileSubtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Manrope-SemiBold',
  },
  howToCarouselContent: {
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 14,
  },
  howToPage: {
    paddingRight: 0,
  },
  howToCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  howToClose: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 2,
    zIndex: 5,
  },
  howToLeft: {
    flex: 1,
    paddingRight: 10,
  },
  howToTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  howToSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  howToArt: {
    width: 66,
    height: 36,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingBottom: 8,
    gap: 4,
  },
  howToBar1: {
    width: 7,
    height: 14,
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
    opacity: 0.45,
  },
  howToBar2: {
    width: 7,
    height: 19,
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
    opacity: 0.65,
  },
  howToBar3: {
    width: 7,
    height: 26,
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
    opacity: 0.92,
  },

  exploreIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  exploreIndicatorActive: {
    width: 24,
    height: 5,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    marginRight: 6,
  },
  exploreIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginRight: 6,
  },
  selectBigCard: {
    marginHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  selectChecklistCard: {
    marginHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingTop: 9,
    paddingBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  selectBigCardEmbedded: {
    marginHorizontal: 0,
    marginBottom: 0,
    paddingHorizontal: 12,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  selectChecklistHeader: {
    paddingHorizontal: 12,
    paddingBottom: 7,
  },
  selectChecklistTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Bold',
  },
  selectChecklistDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 14,
    marginTop: 12,
  },
  selectHalfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  selectTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingVertical: 9,
    paddingHorizontal: 9,
    height: 190,
    overflow: 'hidden',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  selectHalfLeft: {
    zIndex: 1,
  },
  selectHalfRight: {
    zIndex: 1,
  },
  selectDivider: {
    width: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectDividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0,
    backgroundColor: 'transparent',
  },
  selectPlusWrap: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  selectRemoveWrap: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(17,24,39,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    zIndex: 5,
  },
  selectedFill: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },
  selectedImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  selectedMetaWrap: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: '78%',
  },
  selectedBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Bold',
    lineHeight: 12,
  },
  selectedProduct: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-SemiBold',
    opacity: 0.92,
    lineHeight: 12,
  },
  suggestionPager: {
    ...StyleSheet.absoluteFillObject,
  },
  suggestionPage: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  suggestionImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  suggestionImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },
  suggestionMetaWrap: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: '78%',
  },
  suggestionBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Bold',
    lineHeight: 12,
  },
  suggestionProduct: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-SemiBold',
    opacity: 0.92,
    lineHeight: 12,
  },

  actionRowEmbedded: {
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 12,
  },
  saveOutlineButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: BRAND_GREEN,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  saveOutlineText: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_GREEN,
    fontFamily: 'Manrope-SemiBold',
  },
  viewOfferButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  viewOfferText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Manrope-SemiBold',
  },
  actionMenuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  actionMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  actionMenuCard: {
    position: 'absolute',
    width: 210,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
  },
  actionMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionMenuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-SemiBold',
  },
});