// app/(tabs)/compare/index.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';

type QuickTileKey = 'discover' | 'popular' | 'saved';

const SUGGESTION_HEIGHT = 118;

export default function Compare() {
  const router = useRouter();

  const [howToVisible, setHowToVisible] = useState(true);
  const [selectedA, setSelectedA] = useState<string>('Adidas®\nShort sleeve t-shirt');
  const [selectedB, setSelectedB] = useState<string>('Polo Ralph Lauren®\nButton down');
  const [selectedAIndex, setSelectedAIndex] = useState(0);
  const [selectedBIndex, setSelectedBIndex] = useState(0);
  const [lockedA, setLockedA] = useState(false);
  const [lockedB, setLockedB] = useState(false);

  const listARef = useRef<FlatList<{ id: string; title: string; icon: any }> | null>(null);
  const listBRef = useRef<FlatList<{ id: string; title: string; icon: any }> | null>(null);

  const [checklistStep, setChecklistStep] = useState(1);
  const [checklistHidden, setChecklistHidden] = useState(false);
  const doneAnim = useRef(new Animated.Value(0)).current;

  const selectSuggestions = useMemo(
    () => [
      { id: 'a1', title: 'Adidas®\nShort sleeve t-shirt', icon: 'shirt-outline' as const },
      { id: 'a2', title: 'Nike®\nCrew neck tee', icon: 'shirt-outline' as const },
      { id: 'a3', title: 'Uniqlo®\nAirism tee', icon: 'shirt-outline' as const },
    ],
    []
  );

  const selectSuggestionsB = useMemo(
    () => [
      { id: 'b1', title: 'Polo Ralph Lauren®\nButton down', icon: 'shirt-outline' as const },
      { id: 'b2', title: 'Banana Republic®\nOxford shirt', icon: 'shirt-outline' as const },
      { id: 'b3', title: 'J.Crew®\nSlim button-down', icon: 'shirt-outline' as const },
    ],
    []
  );

  useEffect(() => {
    const next = selectSuggestions[selectedAIndex]?.title;
    if (next) setSelectedA(next);
  }, [selectSuggestions, selectedAIndex]);

  useEffect(() => {
    const next = selectSuggestionsB[selectedBIndex]?.title;
    if (next) setSelectedB(next);
  }, [selectSuggestionsB, selectedBIndex]);

  useEffect(() => {
    if (checklistHidden) return;
    if (checklistStep < 3) {
      doneAnim.setValue(0);
      return;
    }

    Animated.spring(doneAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 14,
      stiffness: 220,
      mass: 0.9,
    }).start();

    const t = setTimeout(() => setChecklistHidden(true), 800);
    return () => clearTimeout(t);
  }, [checklistHidden, checklistStep, doneAnim]);

  const onPressSearch = () => router.push('/search' as Href);
  const onPressCameraFind = () => router.push('/camera/index' as Href);

  const onChecklistAdvance = () => setChecklistStep((s) => Math.min(3, s + 1));
  const onPressSaveForLater = () => onPressQuickTile('saved');
  const onPressAnalyze = () => router.push('/compare/results' as Href);

  const getSuggestionLayout = (_: unknown, index: number) => ({ length: SUGGESTION_HEIGHT, offset: SUGGESTION_HEIGHT * index, index });

  const onPressQuickTile = (key: QuickTileKey) => {
    if (key === 'discover') {
      router.push('/search' as Href);
      return;
    }

    if (key === 'popular') {
      return;
    }

    if (key === 'saved') {
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Compare</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={styles.searchBar} onPress={onPressSearch} activeOpacity={0.85}>
            <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
            <TextInput placeholder="Search" placeholderTextColor="#6B7280" style={styles.searchInput} editable={false} pointerEvents="none" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickTilesContent}
            style={styles.quickTilesScroll}
          >
            <TouchableOpacity style={[styles.quickTile]} activeOpacity={0.9} onPress={() => onPressQuickTile('discover')}>
              <Ionicons name="search" size={18} color="#111827" />
              <View style={styles.quickTileTextWrap}>
                <Text style={styles.quickTileTitle}>Discover</Text>
                <Text style={styles.quickTileSubtitle}>Products</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickTile]} activeOpacity={0.9} onPress={() => onPressQuickTile('popular')}>
              <Ionicons name="flame" size={18} color="#111827" />
              <View style={styles.quickTileTextWrap}>
                <Text style={styles.quickTileTitle}>Popular</Text>
                <Text style={styles.quickTileSubtitle}>Comparisons</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickTile]} activeOpacity={0.9} onPress={() => onPressQuickTile('saved')}>
              <Ionicons name="bookmark" size={18} color="#111827" />
              <View style={styles.quickTileTextWrap}>
                <Text style={styles.quickTileTitle}>Saved</Text>
                <Text style={styles.quickTileSubtitle}>Comparisons</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {howToVisible ? (
            <View style={styles.howToCard}>
              <TouchableOpacity style={styles.howToClose} activeOpacity={0.85} onPress={() => setHowToVisible(false)}>
                <Ionicons name="close" size={18} color="#111827" />
              </TouchableOpacity>
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
          ) : null}

          <View style={styles.exploreIndicatorRow}>
            <View style={styles.exploreIndicatorActive} />
            <View style={styles.exploreIndicatorDot} />
            <View style={styles.exploreIndicatorDot} />
            <View style={styles.exploreIndicatorDot} />
          </View>

          <View style={styles.selectChecklistCard}>
            <View style={styles.selectChecklistHeader}>
              <Text style={styles.selectChecklistTitle}>Select Products</Text>
            </View>

            <View style={[styles.selectBigCard, styles.selectBigCardEmbedded]}>
              <View style={[styles.selectHalfCard, styles.selectHalfLeft]}>
                {lockedA ? (
                  <TouchableOpacity style={styles.selectRemoveButton} activeOpacity={0.85} onPress={() => setLockedA(false)}>
                    <Ionicons name="close" size={16} color="#111827" />
                  </TouchableOpacity>
                ) : null}

                {!lockedA ? (
                  <TouchableOpacity style={styles.selectAddButton} activeOpacity={0.85} onPress={() => setLockedA(true)}>
                    <Ionicons name="add" size={18} color="#111827" />
                  </TouchableOpacity>
                ) : null}

                <ScrollView
                  style={styles.suggestionsPager}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                  contentContainerStyle={styles.suggestionsContainer}
                  snapToInterval={SUGGESTION_HEIGHT}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  scrollEnabled={!lockedA}
                  onMomentumScrollEnd={(e) => {
                    if (lockedA) return;
                    const idx = Math.round(e.nativeEvent.contentOffset.y / SUGGESTION_HEIGHT);
                    setSelectedAIndex(Math.max(0, Math.min(selectSuggestions.length - 1, idx)));
                  }}
                >
                  {selectSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionCardVertical}
                      activeOpacity={0.9}
                      onPress={() => {
                        if (lockedA) return;
                        setSelectedAIndex(index);
                      }}
                    >
                      <Ionicons name={item.icon} size={32} color="#6B7280" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.selectedLabel} numberOfLines={1}>
                  {selectedA.split('\n')[0]}
                </Text>

                <TouchableOpacity style={styles.findCameraButtonSmall} activeOpacity={0.9} onPress={onPressCameraFind}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                  <Text style={styles.findCameraButtonText}>Find Product</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.selectDivider}>
                <View style={styles.selectDividerLine} />
              </View>

              <View style={[styles.selectHalfCard, styles.selectHalfRight]}>
                {lockedB ? (
                  <TouchableOpacity style={styles.selectRemoveButton} activeOpacity={0.85} onPress={() => setLockedB(false)}>
                    <Ionicons name="close" size={16} color="#111827" />
                  </TouchableOpacity>
                ) : null}

                {!lockedB ? (
                  <TouchableOpacity style={styles.selectAddButton} activeOpacity={0.85} onPress={() => setLockedB(true)}>
                    <Ionicons name="add" size={18} color="#111827" />
                  </TouchableOpacity>
                ) : null}

                <ScrollView
                  style={styles.suggestionsPager}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                  contentContainerStyle={styles.suggestionsContainer}
                  snapToInterval={SUGGESTION_HEIGHT}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  scrollEnabled={!lockedB}
                  onMomentumScrollEnd={(e) => {
                    if (lockedB) return;
                    const idx = Math.round(e.nativeEvent.contentOffset.y / SUGGESTION_HEIGHT);
                    setSelectedBIndex(Math.max(0, Math.min(selectSuggestionsB.length - 1, idx)));
                  }}
                >
                  {selectSuggestionsB.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionCardVertical}
                      activeOpacity={0.9}
                      onPress={() => {
                        if (lockedB) return;
                        setSelectedBIndex(index);
                      }}
                    >
                      <Ionicons name={item.icon} size={32} color="#6B7280" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.selectedLabel} numberOfLines={1}>
                  {selectedB.split('\n')[0]}
                </Text>

                <TouchableOpacity style={styles.findCameraButtonSmall} activeOpacity={0.9} onPress={onPressCameraFind}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                  <Text style={styles.findCameraButtonText}>Find Product</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.selectChecklistDivider} />

            {!checklistHidden ? (
              <TouchableOpacity style={styles.checklistCardEmbedded} activeOpacity={0.9} onPress={onChecklistAdvance}>
                <View style={styles.checklistHeader}>
                  <Text style={styles.checklistTitle}>Compare Checklist</Text>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: doneAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }),
                        },
                      ],
                    }}
                  >
                    <View style={[styles.checklistIcon, checklistStep >= 3 ? styles.checklistIconDone : null]}>
                      <Ionicons name="checkmark" size={18} color={checklistStep >= 3 ? '#FFFFFF' : '#111827'} />
                    </View>
                  </Animated.View>
                </View>

                <View style={styles.segmentRow}>
                  <View style={[styles.segment, checklistStep >= 1 ? styles.segmentOn : styles.segmentOff]} />
                  <View style={[styles.segment, checklistStep >= 2 ? styles.segmentOn : styles.segmentOff]} />
                  <View style={[styles.segment, checklistStep >= 3 ? styles.segmentOn : styles.segmentOff]} />
                </View>
                <Text style={styles.progressText}>{Math.min(3, checklistStep)}/3</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.saveOutlineButton} activeOpacity={0.9} onPress={onPressSaveForLater}>
              <Ionicons name="bookmark-outline" size={18} color={BRAND_GREEN} />
              <Text style={styles.saveOutlineText}>Save for later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyzeButton} activeOpacity={0.9} onPress={onPressAnalyze}>
              <Ionicons name="analytics" size={18} color="#FFFFFF" />
              <Text style={styles.analyzeText}>Analyze</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
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
    height: 52,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
    paddingTop: 4,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    paddingHorizontal: 18,
    marginBottom: 10,
    marginTop: 2,
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  quickTilesScroll: {
    marginBottom: 32,
  },
  quickTilesContent: {
    paddingLeft: 18,
    paddingRight: 0,
  },
  quickTile: {
    width: 180,
    height: 180,
    borderRadius: 22,
    backgroundColor: '#E5E7EB', // Changed to a soft grey color
    borderWidth: 0,
    borderColor: 'transparent',
    padding: 14,
    overflow: 'hidden',
    marginRight: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  quickTileTextWrap: {
    position: 'absolute',
    left: 14,
    bottom: 14,

    right: 14,
  },
  quickTileTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  quickTileSubtitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    opacity: 0.9,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  howToCard: {
    marginHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  howToSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  howToArt: {
    width: 100,
    height: 52,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingBottom: 10,

    gap: 6,
  },
  howToBar1: {
    width: 10,
    height: 20,
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
    opacity: 0.45,
  },
  howToBar2: {
    width: 10,
    height: 28,
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
    opacity: 0.65,
  },
  howToBar3: {
    width: 10,
    height: 36,
    borderRadius: 4,
    backgroundColor: BRAND_GREEN,
    opacity: 0.92,
  },
  exploreIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    marginHorizontal: 18,
    borderRadius: 18,
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
    marginHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingTop: 12,
    paddingBottom: 12,
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
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  selectChecklistHeader: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  selectChecklistTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
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
    borderRadius: 18,
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
  selectHalfLeft: {
    zIndex: 1,
  },
  selectHalfRight: {
    zIndex: 1,
  },
  selectDivider: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectDividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#D1D5DB',
  },
  selectAddButton: {
    position: 'absolute',
    right: 12,
    bottom: 58,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  selectRemoveButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  suggestionsContainer: {
    paddingHorizontal: 0,
  },
  suggestionsPager: {
    height: SUGGESTION_HEIGHT,
  },
  suggestionCardVertical: {
    height: SUGGESTION_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLabel: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 16,
    paddingRight: 6,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  findCameraButtonSmall: {
    height: 28,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  findCameraButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  checklistCardEmbedded: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  checklistIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistIconDone: {
    backgroundColor: BRAND_GREEN,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  segmentOn: {
    backgroundColor: BRAND_GREEN,
  },
  segmentOff: {
    backgroundColor: '#E5E7EB',
  },
  actionRow: {
    marginTop: 12,
    marginHorizontal: 18,
    flexDirection: 'row',
    gap: 12,
  },
  saveOutlineButton: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: BRAND_GREEN,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 7,
  },
  saveOutlineText: {
    fontSize: 13,
    fontWeight: '800',
    color: BRAND_GREEN,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  analyzeButton: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 9,
  },
  analyzeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});