import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DealoWordmarkGreenBlack from '../../../assets/images/logos/dealo-wordmark-greenblack';
import DealoMarkGreen from '../../../assets/images/logos/dealo-mark-green';

const BRAND_GREEN = '#0E9F6E';

const { width } = Dimensions.get('window');

const trendingProducts = [
  {
    id: '1',
    name: 'Smart Speaker',
    store: 'Amazon',
    price: '$99.99',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'LA Dodger Hat',
    store: 'Walmart',
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Headphones',
    store: 'Target',
    price: '$149.99',
    image: 'https://images.unsplash.com/photo-1518441315630-3cb2f5223d82?auto=format&fit=crop&w=800&q=80',
  },
];

const storeProducts = [
  {
    id: '1',
    name: 'Xbox One',
    store: 'Target',
    price: '$499.99',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'TV 75"',
    store: 'Walmart',
    price: '$799.99',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Headphones',
    store: 'Best Buy',
    price: '$199.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
];

const similarProducts = [
  {
    id: '1',
    name: 'White T-Shirt',
    store: 'Uniqlo',
    price: '$19.99',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Jeans',
    store: 'Amazon',
    price: '$59.99',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Sneakers',
    store: 'Nike',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
];

const brandProducts = [
  {
    id: '1',
    name: 'AirPods Pro',
    store: 'Apple',
    price: '$249.99',
    image: 'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Running Shoes',
    store: 'Nike',
    price: '$109.99',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Denim Jacket',
    store: 'Levi\'s',
    price: '$89.99',
    image: 'https://images.unsplash.com/photo-1520975869017-a7f1f8fefe7b?auto=format&fit=crop&w=800&q=80',
  },
];

const navItems = [
  { label: 'Notifications', icon: 'notifications' as const },
  { label: 'Following', icon: 'people-outline' as const },
  { label: 'Saved', icon: 'bookmark-outline' as const },
];

export default function Home() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('Categories');

  interface Product {
    id: string;
    name: string;
    store: string;
    price: string;
    image: string;
  }

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity style={styles.heartIcon}>
          <Ionicons name="heart-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.productStore} numberOfLines={1}>
        {item.store}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <DealoWordmarkGreenBlack width={120} height={26} />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.85} onPress={() => router.push('/account' as Href)}>
            <Ionicons name="person" size={22} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchContainer} onPress={() => router.push('/search' as Href)}>
          <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search" 
            placeholderTextColor="#6B7280" 
            editable={false}
            pointerEvents="none"
          />
          <TouchableOpacity style={styles.searchCameraButton} onPress={() => router.push('/camera' as Href)}>
            <Ionicons name="camera-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Navigation Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navContainer}>
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.navItem, activeNav === item.label && styles.activeNavItem]}
              onPress={() => {
                setActiveNav(item.label);
                if (item.label === 'Notifications') router.push('/(tabs)/home/notifications' as any);
                if (item.label === 'Saved') router.push('/(tabs)/home/saved');
                if (item.label === 'Following') router.push('/(tabs)/home/following');
              }}
              activeOpacity={0.85}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={BRAND_GREEN}
                style={styles.navIcon}
              />
              <Text style={[styles.navText, activeNav === item.label && styles.activeNavText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Snap to Search Card */}
        <TouchableOpacity style={styles.snapCard} activeOpacity={0.9} onPress={() => router.push('/(tabs)/camera')}>
          <View style={styles.snapTop}>
            <View style={styles.snapIllustration}>
              <View style={[styles.starDot, { top: 18, left: 24, opacity: 0.35 }]} />
              <View style={[styles.starDot, { top: 42, right: 38, opacity: 0.25 }]} />
              <View style={[styles.starDot, { bottom: 28, left: 56, opacity: 0.2 }]} />
              <View style={styles.illusCameraWrapper}>
                <Ionicons name="camera" size={60} color="rgba(255,255,255,0.28)" />
              </View>
              <View style={styles.illusTagWrapper}>
                <Ionicons name="pricetag" size={44} color={BRAND_GREEN} />
              </View>
            </View>
          </View>
          <View style={styles.snapBottom}>
            <View style={styles.snapBottomIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
            <Text style={styles.snapBottomText}>Snap a picture to get started</Text>
          </View>
        </TouchableOpacity>

        {/* Trending Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Trending Products</Text>
          </View>
          <FlatList
            data={trendingProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        {/* Smart Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Smart Suggestions</Text>
          </View>
          <Text style={styles.smallSectionTitle}>From Stores You Liked</Text>
          <FlatList
            data={storeProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        {/* Similar to What You Liked */}
        <View style={[styles.section, { marginBottom: 10 }]}>
          <Text style={styles.smallSectionTitle}>Similar to What You Liked</Text>
          <FlatList
            data={similarProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        <View style={[styles.section, { marginBottom: 10 }]}>
          <Text style={styles.smallSectionTitle}>From Brands you liked</Text>
          <FlatList
            data={brandProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <DealoMarkGreen width={20} height={22} />
          </View>
          <Text style={styles.footerTagline}>Shop Smart. Save Big.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
    backdropFilter: 'blur(20px)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  searchCameraButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    backdropFilter: 'blur(10px)',
  },
  activeNavItem: {
    backgroundColor: '#F3F4F6',
  },
  navIcon: {
    marginRight: 8,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  activeNavText: {
    color: '#111827',
  },
  snapCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#111B3A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  snapTop: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapIllustration: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  illusCameraWrapper: {
    position: 'absolute',
    left: width * 0.18,
    top: 50,
    transform: [{ rotate: '-10deg' }],
  },
  illusTagWrapper: {
    position: 'absolute',
    right: width * 0.18,
    top: 66,
    transform: [{ rotate: '18deg' }],
  },
  snapBottom: {
    height: 72,
    backgroundColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  snapBottomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  snapBottomText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginTop: 24,
  },
  sectionTitleNoPad: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  snapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  snapSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  smallSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  productsContainer: {
    paddingLeft: 20,
    paddingRight: 6,
  },
  productCard: {
    width: 150,
    marginRight: 14,
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
  },
  heartIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(17,24,39,0.45)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productStore: {
    fontSize: 10,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 34,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.35,
    marginBottom: 8,
  },
  footerTagline: {
    fontSize: 16,
    fontWeight: '300',
    color: '#9CA3AF',
    opacity: 0.6,
    letterSpacing: -0.2,
  },
});
