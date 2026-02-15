import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';
const { width } = Dimensions.get('window');

type SavedItem = {
  id: string;
  brand: string;
  title: string;
  image: string;
};

type SavedComparison = {
  id: string;
  title: string;
  brand: string;
  scoreA: number;
  scoreB: number;
};

const SAVED_ITEMS: SavedItem[] = [
  {
    id: '1',
    brand: 'Nike',
    title: 'Alphabete Athletics Nike Killer Pants',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    brand: 'Nike',
    title: 'Alphabete Athletic Black Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    brand: 'Adidas',
    title: 'Sport Shoes Running Edition',
    image: 'https://images.unsplash.com/photo-1528701800489-20be3c3ea7aa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '4',
    brand: 'Puma',
    title: 'Training Jacket Premium',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '5',
    brand: 'Under Armour',
    title: 'Compression Shirt Tech',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80',
  },
];

const SAVED_SCANS: SavedItem[] = [
  {
    id: 'scan-1',
    brand: 'Samsung',
    title: '75" Smart TV',
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'scan-2',
    brand: 'Apple',
    title: 'MacBook Pro',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'scan-3',
    brand: 'KitchenAid',
    title: 'Stand Mixer',
    image: 'https://images.unsplash.com/photo-1514516430039-0f2b57d4f2e8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'scan-4',
    brand: 'Bose',
    title: 'Wireless Speaker',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
  },
];

const SAVED_COMPARISONS: SavedComparison[] = [
  { id: 'cmp-1', title: 'Samsung v. iPhone', brand: 'Samsung', scoreA: 90, scoreB: 82 },
  { id: 'cmp-2', title: 'AirPods v. Beats', brand: 'Apple', scoreA: 88, scoreB: 84 },
  { id: 'cmp-3', title: 'Adidas v. Nike', brand: 'Nike', scoreA: 81, scoreB: 78 },
];

type SavedFilter = 'all' | 'favorites' | 'scans' | 'comparisons';

function FilterGlyph() {
  return (
    <View style={[styles.filterGlyph, styles.filterGlyphFlipped]}>
      <View style={[styles.filterLine, styles.filterLine1]} />
      <View style={[styles.filterLine, styles.filterLine2]} />
      <View style={[styles.filterLine, styles.filterLine3]} />
    </View>
  );
}

function ScoreBadge({ top, bottom }: { top: number; bottom: number }) {
  const percent = Math.max(0, Math.min(1, top / 100));

  return (
    <View style={styles.scoreBadge}>
      <View style={styles.scoreRing}>
        <View style={[styles.scoreRingTrack]} />
        <View style={[styles.scoreRingFill, { transform: [{ rotate: '-110deg' }] }]} />
      </View>
      <View style={styles.scoreNumsCol}>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={styles.scoreMain}>
          {top}
        </Text>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={styles.scoreSecondary}>
          {bottom}
        </Text>
      </View>
      <View style={[styles.scoreMask, { width: `${(1 - percent) * 100}%` }]} />
      <View style={styles.scoreBorder} />
    </View>
  );
}

function MiniStack() {
  const frontSize = 116;
  const backSize = 112;
  const backX = 84;
  const frontY = 0;
  const backY = 22;
  const stackW = backX + backSize;
  const stackH = Math.max(backY + backSize, frontY + frontSize);

  return (
    <View style={[styles.miniStackWrap, { width: stackW, height: stackH }]}>
      <View pointerEvents="none" style={[styles.miniBackCard, { width: backSize, height: backSize, left: backX, top: backY }]} />
      <View style={[styles.miniFront, { width: frontSize, height: frontSize, left: 0, top: frontY }]} />
    </View>
  );
}

function getInitial(label: string) {
  const trimmed = label.trim();
  return trimmed ? trimmed[0]?.toUpperCase() ?? '' : '';
}

function ComparisonTile({ item }: { item: SavedComparison }) {
  const best = Math.max(item.scoreA, item.scoreB);
  const worst = Math.min(item.scoreA, item.scoreB);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.comparisonTileWrap} onPress={() => {}}>
      <View style={styles.comparisonTileCard}>
        <ScoreBadge top={best} bottom={worst} />
        <MiniStack />
        <TouchableOpacity activeOpacity={0.85} style={styles.comparisonHeart}>
          <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.comparisonMetaRow}>
        <View style={styles.comparisonLogoCircle}>
          <Text style={styles.comparisonLogoText}>{getInitial(item.brand)}</Text>
        </View>
        <Text style={styles.comparisonTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Saved() {
  const router = useRouter();
  const collectionThumbs = useMemo(() => SAVED_ITEMS.slice(0, 3), []);

  const [activeFilter, setActiveFilter] = useState<SavedFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);

  const renderItem = ({ item }: ListRenderItemInfo<SavedItem>) => {
    return (
      <View style={styles.tile}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <TouchableOpacity activeOpacity={0.9} style={styles.heartBtn}>
            <Ionicons name="heart" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.brand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={[]}
        keyExtractor={() => 'saved'}
        renderItem={null as any}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={22} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Saved</Text>
              <View style={styles.headerRightSpacer} />
            </View>

            <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => router.push('/search' as Href)}>
              <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
              <Text style={styles.searchInput}>Search</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity activeOpacity={0.9} style={styles.collectionCardFull} onPress={() => setCreateOpen(true)}>
                <Text style={styles.createText}>+ Create collection</Text>

                <View style={styles.booksStack}>
                  {collectionThumbs.map((t, idx) => (
                    <View
                      key={t.id}
                      style={[
                        styles.book,
                        idx === 0 && styles.bookLeft,
                        idx === 1 && styles.bookMid,
                        idx === 2 && styles.bookRight,
                      ]}
                    >
                      <Image source={{ uri: t.image }} style={styles.bookImg} />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

            {collections.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionsRow}>
                {collections.map((c) => (
                  <View key={c.id} style={styles.collectionItemCard}>
                    <Text style={styles.collectionName} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <View style={styles.booksStack}>
                      {collectionThumbs.map((t) => (
                        <View key={`${c.id}-${t.id}`} style={styles.book}>
                          <Image source={{ uri: t.image }} style={styles.bookImg} />
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : null}

            <View style={styles.allItemsRow}>
              <Text style={[styles.sectionTitle, { marginTop: 22 }]}>All Items</Text>
            </View>

            {filterOpen ? (
              <View style={styles.filterMenuWrap}>
                <View style={styles.filterMenu}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.filterMenuItem}
                    onPress={() => {
                      setActiveFilter('all');
                      setFilterOpen(false);
                    }}
                  >
                    <Text style={styles.filterMenuText}>All items</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.filterMenuItem}
                    onPress={() => {
                      setActiveFilter('favorites');
                      setFilterOpen(false);
                    }}
                  >
                    <Text style={styles.filterMenuText}>Favorites</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.filterMenuItem}
                    onPress={() => {
                      setActiveFilter('scans');
                      setFilterOpen(false);
                    }}
                  >
                    <Text style={styles.filterMenuText}>Scans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.filterMenuItem, styles.filterMenuItemLast]}
                    onPress={() => {
                      setActiveFilter('comparisons');
                      setFilterOpen(false);
                    }}
                  >
                    <Text style={styles.filterMenuText}>Comparisons</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {activeFilter === 'all' || activeFilter === 'favorites' ? (
              <>
                <View style={styles.subheaderRow}>
                  <Text style={styles.subheader}>Favorites</Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.iconOnlyBtn}
                    onPress={() => setFilterOpen((v) => !v)}
                  >
                    <FilterGlyph />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={SAVED_ITEMS}
                  keyExtractor={(i) => i.id}
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.column}
                  renderItem={renderItem}
                />
              </>
            ) : null}

            {activeFilter === 'all' || activeFilter === 'scans' ? (
              <>
                <View style={styles.subheaderRow}>
                  <Text style={styles.subheader}>Scans</Text>
                  <TouchableOpacity activeOpacity={0.85} style={styles.iconOnlyBtn}>
                    <FilterGlyph />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={SAVED_SCANS}
                  keyExtractor={(i) => i.id}
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.column}
                  renderItem={renderItem}
                />
              </>
            ) : null}

            {activeFilter === 'all' || activeFilter === 'comparisons' ? (
              <>
                <View style={styles.subheaderRow}>
                  <Text style={styles.subheader}>Comparisons</Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.iconOnlyBtn}
                    onPress={() => router.push('/compare/savedComparisons?returnTo=/home/saved' as Href)}
                  >
                    <FilterGlyph />
                  </TouchableOpacity>
                </View>
                <View style={styles.comparisonsList}>
                  {SAVED_COMPARISONS.map((c) => (
                    <ComparisonTile key={c.id} item={c} />
                  ))}
                </View>
              </>
            ) : null}

            <View style={{ height: 18 }} />

            <Modal transparent visible={createOpen} animationType="fade" onRequestClose={() => setCreateOpen(false)}>
              <Pressable style={styles.modalOverlay} onPress={() => setCreateOpen(false)} />
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Create collection</Text>
                <TextInput
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  placeholder="Collection name"
                  placeholderTextColor="#9CA3AF"
                  style={styles.modalInput}
                />
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity activeOpacity={0.9} style={styles.modalBtnSecondary} onPress={() => setCreateOpen(false)}>
                    <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.modalBtnPrimary}
                    onPress={() => {
                      const name = newCollectionName.trim();
                      if (!name) return;
                      setCollections((prev) => [{ id: `c-${Date.now()}`, name }, ...prev]);
                      setNewCollectionName('');
                      setCreateOpen(false);
                    }}
                  >
                    <Text style={styles.modalBtnPrimaryText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingBottom: 20,
  },

  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Manrope-Regular',
  },

  searchContainer: {
    marginHorizontal: 16,
    marginTop: 6,
    height: 48,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    fontFamily: 'Manrope-Regular',
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  subheader: {
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  subheaderMuted: {
    color: '#4B5563',
    fontWeight: '700',
  },
  subheaderRow: {
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconOnlyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginRight: 16,
  },

  filterMenuWrap: {
    position: 'relative',
    zIndex: 50,
  },
  filterMenu: {
    position: 'absolute',
    right: 16,
    top: 6,
    width: 170,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
    overflow: 'hidden',
  },
  filterMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17,24,39,0.06)',
  },
  filterMenuItemLast: {
    borderBottomWidth: 0,
  },
  filterMenuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },

  filterGlyph: {
    width: 18,
    height: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
  filterGlyphFlipped: {
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

  collectionsRow: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 12,
  },
  collectionCardFull: {
    marginHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  collectionCard: {
    width: 220,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  collectionItemCard: {
    width: 220,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    overflow: 'hidden',
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    fontFamily: 'Manrope-Regular',
  },
  createText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Manrope-Regular',
  },

  booksStack: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  book: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  bookLeft: {},
  bookMid: {},
  bookRight: {},
  bookImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  column: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    gap: 14,
  },

  tile: {
    width: (width - 16 * 2 - 14) / 2,
    marginBottom: 18,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: 172,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0E9F6E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  brand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'Manrope-Regular',
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 14,
    fontFamily: 'Manrope-Regular',
  },

  comparisonsList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  comparisonTileWrap: {
    width: width - 16 * 2,
  },
  comparisonTileCard: {
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    padding: 12,
    height: 158,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  scoreBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  scoreRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRingTrack: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#D1FAE5',
  },
  scoreRingFill: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: BRAND_GREEN,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  scoreNumsCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreMain: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 12,
    includeFontPadding: false,
    fontFamily: 'Manrope-Regular',
  },
  scoreSecondary: {
    marginTop: 1,
    fontSize: 8,
    fontWeight: '800',
    color: '#111827',
    opacity: 0.6,
    lineHeight: 8,
    includeFontPadding: false,
    fontFamily: 'Manrope-Regular',
  },
  scoreMask: {
    position: 'absolute',
    right: 1,
    top: 1,
    bottom: 1,
    backgroundColor: '#FFFFFF',
  },
  scoreBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
  },
  comparisonHeart: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(17,24,39,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  comparisonLogoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonLogoText: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_GREEN,
    fontFamily: 'Manrope-Regular',
  },
  comparisonTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  miniStackWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  miniBackCard: {
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.05)',
    opacity: 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 2,
  },
  miniFront: {
    position: 'absolute',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
    overflow: 'hidden',
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.35)',
  },
  modalCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 180,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
    marginBottom: 12,
  },
  modalInput: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.14)',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalBtnSecondary: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  modalBtnPrimary: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
  },
});
