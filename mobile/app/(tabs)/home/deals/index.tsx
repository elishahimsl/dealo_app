import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Deal = {
  id: string;
  title: string;
  image: string;
};

const FILTERS = ['For You', 'Hot Deals', 'Limited Time'] as const;

const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: '75" Samsung TV',
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    title: 'Apple Macbook',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    title: 'Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    title: 'Modern Sofa',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    title: 'Wireless Speaker',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    title: 'Kitchen Mixer',
    image: 'https://images.unsplash.com/photo-1514516430039-0f2b57d4f2e8?auto=format&fit=crop&w=900&q=80',
  },
];

export default function Deals() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('For You');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = MOCK_DEALS;
    if (!q) return base;
    return base.filter((d) => d.title.toLowerCase().includes(q));
  }, [query]);

  const renderItem = ({ item }: ListRenderItemInfo<Deal>) => {
    return (
      <View style={styles.tile}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <TouchableOpacity activeOpacity={0.9} style={styles.heartBtn}>
            <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>

        <View style={styles.reactions}>
          <TouchableOpacity activeOpacity={0.85} style={styles.reactionBtn}>
            <Ionicons name="thumbs-up-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.reactionBtn}>
            <Ionicons name="thumbs-down-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              <Text style={styles.headerTitle}>Deals</Text>
              <View style={styles.headerRightSpacer} />
            </View>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search Product"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>

            <View style={styles.filterRow}>
              {FILTERS.map((f) => {
                const active = f === activeFilter;
                return (
                  <TouchableOpacity
                    key={f}
                    activeOpacity={0.9}
                    onPress={() => setActiveFilter(f)}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Deals based on your interests</Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.sectionAction}>
                <Ionicons name="options-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
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
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.2,
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#111827',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.2,
    maxWidth: '82%',
  },
  sectionAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  column: {
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    gap: 12,
  },
  tile: {
    width: (width - 48) / 2,
    marginBottom: 14,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  reactions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  reactionBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
