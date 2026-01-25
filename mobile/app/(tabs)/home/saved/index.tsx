import React, { useMemo } from 'react';
import {
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

type SavedItem = {
  id: string;
  brand: string;
  title: string;
  image: string;
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

export default function Saved() {
  const collectionThumbs = useMemo(() => SAVED_ITEMS.slice(0, 3), []);

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
        data={SAVED_ITEMS}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Saved</Text>
            </View>

            <Text style={styles.sectionTitle}>Collections</Text>
            <View style={styles.collectionCard}>
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
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 22 }]}>All Items</Text>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },

  collectionCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  createText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 8,
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
    paddingHorizontal: 18,
    justifyContent: 'flex-start',
    gap: 12,
  },

  tile: {
    flex: 0.5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
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
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 14,
  },
});
