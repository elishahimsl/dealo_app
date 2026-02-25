import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';

const FONT_REGULAR = 'Manrope-Regular';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

type FilterKey = 'all' | 'viewed' | 'scanned' | 'compared';

type RecentItem = {
  id: string;
  brand: string;
  name: string;
  category: string;
  image: string;
  brandLogoText: string;
  isDeal?: boolean;
  dealText?: string;
};

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function RecentCard({ item }: { item: RecentItem }) {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.tile}>
        <Image source={{ uri: item.image }} style={styles.tileImage} resizeMode="contain" />

        {item.isDeal ? (
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>{item.dealText ?? 'Deal'}</Text>
          </View>
        ) : null}

        <TouchableOpacity activeOpacity={0.85} style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>{item.brandLogoText}</Text>
        </View>
        <View style={styles.metaTextCol}>
          <Text style={styles.brandText} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.productText} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.categoryText} numberOfLines={1}>
            {item.category}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function RecentsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string; returnTo?: string }>();
  const returnTo = (params.returnTo ?? '').toString().trim();
  const initialFilter = useMemo<FilterKey>(() => {
    const raw = (params.filter ?? '').toString().toLowerCase();
    if (raw === 'viewed') return 'viewed';
    if (raw === 'scanned') return 'scanned';
    if (raw === 'compared') return 'compared';
    return 'all';
  }, [params.filter]);

  const [filter, setFilter] = useState<FilterKey>(initialFilter);

  const viewedItems: RecentItem[] = useMemo(
    () => [
      {
        id: 'v1',
        brand: 'Sony',
        name: 'WH-1000XM5 Noise Canceling Headphones',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'S',
        isDeal: true,
        dealText: '$20 off',
      },
      {
        id: 'v2',
        brand: 'Beats',
        name: 'Solo 4 Headphones (ANC, Fast Fuel)',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f9?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'B',
        isDeal: true,
        dealText: '25% off',
      },
      {
        id: 'v3',
        brand: 'Apple',
        name: 'AirPods Pro (2nd Gen) — MagSafe Case',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'A',
        isDeal: true,
        dealText: '$10 off',
      },
      {
        id: 'v4',
        brand: 'Bose',
        name: 'QuietComfort Ultra Headphones',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'B',
      },
      {
        id: 'v5',
        brand: 'Nike',
        name: 'Air Zoom Pegasus 41 Running Shoes',
        category: 'Mens',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'N',
      },
      {
        id: 'v6',
        brand: "Levi's",
        name: 'Classic Denim Jacket — Trucker Fit',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'L',
      },
      {
        id: 'v7',
        brand: 'Dyson',
        name: 'V15 Detect Cordless Vacuum',
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1581578029523-3f5b3c52db64?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'D',
      },
      {
        id: 'v8',
        brand: 'Adidas',
        name: 'Ultraboost Running Sneakers',
        category: 'Mens',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'A',
      },
    ],
    []
  );

  const scannedItems: RecentItem[] = useMemo(
    () => [
      {
        id: 's1',
        brand: 'Samsung',
        name: '75" Smart TV',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'S',
        isDeal: true,
        dealText: '20% off',
      },
      {
        id: 's2',
        brand: 'Apple',
        name: 'MacBook Pro',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'A',
        isDeal: true,
        dealText: '$30 off',
      },
      {
        id: 's3',
        brand: 'Sony',
        name: 'Noise Cancelling Headphones',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'S',
      },
      {
        id: 's4',
        brand: 'IKEA',
        name: 'Modern Sofa',
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'I',
      },
      {
        id: 's5',
        brand: 'KitchenAid',
        name: 'Stand Mixer',
        category: 'Kitchen',
        image: 'https://images.unsplash.com/photo-1514516430039-0f2b57d4f2e8?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'K',
        isDeal: true,
        dealText: '25% off',
      },
      {
        id: 's6',
        brand: 'Bose',
        name: 'Wireless Speaker',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'B',
      },
      {
        id: 's7',
        brand: 'Coach',
        name: 'Everyday Tote',
        category: 'Womens',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'C',
      },
      {
        id: 's8',
        brand: 'Casio',
        name: 'Classic Watch',
        category: 'Mens',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'C',
      },
    ],
    []
  );

  const comparedItems: RecentItem[] = useMemo(
    () => [
      {
        id: 'c1',
        brand: 'Samsung',
        name: 'Galaxy S24',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'S',
      },
      {
        id: 'c2',
        brand: 'Apple',
        name: 'iPhone 15 Pro',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1512499617640-c74ae3b5f828?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'A',
      },
      {
        id: 'c3',
        brand: 'Nike',
        name: 'Air Max',
        category: 'Mens',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'N',
      },
      {
        id: 'c4',
        brand: 'Adidas',
        name: 'Superstar',
        category: 'Mens',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'A',
      },
      {
        id: 'c5',
        brand: 'Dyson',
        name: 'Airwrap',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'D',
      },
      {
        id: 'c6',
        brand: 'Shark',
        name: 'FlexStyle',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'S',
      },
      {
        id: 'c7',
        brand: 'Levi\'s',
        name: 'Denim Jacket',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'L',
      },
      {
        id: 'c8',
        brand: 'Zara',
        name: 'Street Style',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1520975958221-b36dd9b8a6bd?auto=format&fit=crop&w=900&q=80',
        brandLogoText: 'Z',
      },
    ],
    []
  );

  const items = useMemo(() => {
    if (filter === 'viewed') return viewedItems;
    if (filter === 'scanned') return scannedItems;
    if (filter === 'compared') return comparedItems;
    return viewedItems;
  }, [comparedItems, filter, scannedItems, viewedItems]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.85}
          onPress={() => {
            if (returnTo) router.replace(returnTo as Href);
            else if (router.canGoBack()) router.back();
            else router.replace('/account' as Href);
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Recents</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => router.push('/(tabs)/search' as Href)}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <Text style={styles.searchInput}>Search</Text>
      </TouchableOpacity>

      <View style={styles.pillsRow}>
        <FilterPill label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterPill label="Viewed" active={filter === 'viewed'} onPress={() => setFilter('viewed')} />
        <FilterPill label="Scanned" active={filter === 'scanned'} onPress={() => setFilter('scanned')} />
        <FilterPill label="Compared" active={filter === 'compared'} onPress={() => setFilter('compared')} />
      </View>

      {filter === 'all' ? (
        <FlatList
          data={[]}
          keyExtractor={() => 'all'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={null as any}
          ListHeaderComponent={
            <View>
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
              <FlatList
                data={viewedItems.slice(0, 6)}
                keyExtractor={(it) => it.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.columnWrap}
                renderItem={({ item }) => <RecentCard item={item} />}
              />

              <Text style={styles.sectionTitle}>Recently Scanned</Text>
              <FlatList
                data={scannedItems.slice(0, 6)}
                keyExtractor={(it) => it.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.columnWrap}
                renderItem={({ item }) => <RecentCard item={item} />}
              />

              <Text style={styles.sectionTitle}>Recently Compared</Text>
              <FlatList
                data={comparedItems.slice(0, 6)}
                keyExtractor={(it) => it.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.columnWrap}
                renderItem={({ item }) => <RecentCard item={item} />}
              />
            </View>
          }
        />
      ) : (
        <FlatList
          key={filter}
          data={items}
          keyExtractor={(it) => it.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrap}
          renderItem={({ item }) => <RecentCard item={item} />}
          ListHeaderComponent={<Text style={styles.sectionTitle}>{filter === 'viewed' ? 'Recently Viewed' : filter === 'scanned' ? 'Recently Scanned' : 'Recently Compared'}</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerRow: {
    paddingHorizontal: 14,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
    fontFamily: FONT_BOLD,
  },
  searchContainer: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 18,
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
    fontFamily: FONT_REGULAR,
  },
  pillsRow: {
    paddingHorizontal: 14,
    paddingTop: 0,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#111827',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONT_SEMI,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 28,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
    fontFamily: FONT_SEMI,
  },
  columnWrap: {
    gap: 12,
  },
  cardWrap: {
    flex: 1,
    marginBottom: 16,
  },
  tile: {
    height: 170,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImage: {
    width: '86%',
    height: '78%',
  },
  dealBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
  },
  dealBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.15,
    fontFamily: FONT_BOLD,
  },
  heartBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_GREEN,
    fontFamily: FONT_BOLD,
  },
  metaTextCol: {
    flex: 1,
    paddingTop: 1,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONT_SEMI,
  },
  productText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    fontFamily: FONT_REGULAR,
    lineHeight: 16,
  },
  categoryText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: -0.15,
    fontFamily: FONT_REGULAR,
  },
});
