import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

const stores = [
  { id: '1', name: 'Nike', domain: 'nike.com', color: '#111827' },
  { id: '2', name: 'Amazon', domain: 'amazon.com', color: '#FF9900' },
  { id: '3', name: 'Apple', domain: 'apple.com', color: '#111827' },
  { id: '4', name: 'Target', domain: 'target.com', color: '#CC0000' },
  { id: '5', name: 'Walmart', domain: 'walmart.com', color: '#0071CE' },
  { id: '6', name: 'Best Buy', domain: 'bestbuy.com', color: '#0046BE' },
];

const categories = [
  { id: '1', name: 'Electronics', icon: 'laptop-outline' as const },
  { id: '2', name: 'Clothing', icon: 'shirt-outline' as const },
  { id: '3', name: 'Home', icon: 'home-outline' as const },
  { id: '4', name: 'Beauty', icon: 'sparkles-outline' as const },
  { id: '5', name: 'Toys', icon: 'game-controller-outline' as const },
  { id: '6', name: 'Sports', icon: 'basketball-outline' as const },
];

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'iPhone 15 Pro',
    'Nike Air Max',
    'Samsung TV',
    'LEGO Set',
  ]);
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  useEffect(() => {
    setShowRecentSearches(recentSearches.length > 0);
  }, [recentSearches]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const updatedSearches = [query, ...recentSearches.filter(item => item !== query)].slice(0, 10);
      setRecentSearches(updatedSearches);
      // TODO: Navigate to search results when results page is created
      console.log('Searching for:', query);
    }
  };

  const deleteRecentSearch = (item: string) => {
    const updatedSearches = recentSearches.filter(search => search !== item);
    setRecentSearches(updatedSearches);
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderStoreItem = ({ item }: { item: typeof stores[0] }) => (
    <TouchableOpacity style={styles.storeItem} activeOpacity={0.85}>
      <View style={[styles.storeLogoTile, { borderColor: `${item.color}22` }]}>
        <Image
          source={{ uri: `https://logo.clearbit.com/${item.domain}` }}
          style={styles.storeLogo}
        />
      </View>
      <Text style={styles.storeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={20} color="#6B7280" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <View style={styles.recentSearchItem}>
      <TouchableOpacity 
        style={styles.recentSearchContent}
        onPress={() => handleSearch(item)}
      >
        <Ionicons name="time-outline" size={16} color="#9CA3AF" />
        <Text style={styles.recentSearchText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteRecentSearch(item)}
      >
        <Ionicons name="close-outline" size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, stores, deals..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recent Searches */}
        {showRecentSearches && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearAllRecentSearches}>
                <Text style={styles.clearAllText}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearchItem}
              keyExtractor={(item, index) => `recent-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Featured Stores */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>Featured Stores</Text>
          <FlatList
            data={stores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.storeRow}
            contentContainerStyle={styles.storesGrid}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  sectionTitleSpacing: {
    marginBottom: 14,
  },
  clearAllText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  recentSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  deleteButton: {
    padding: 4,
  },
  storesGrid: {
    paddingTop: 2,
  },
  storeRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  storeItem: {
    width: (width - 32 - 16) / 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  storeLogoTile: {
    width: 74,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeLogo: {
    width: 54,
    height: 22,
    resizeMode: 'contain',
  },
  storeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});