 import React, { useMemo, useState } from 'react';
 import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, Platform } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import { useRouter } from 'expo-router';
 
 const BRAND_GREEN = '#0E9F6E';
 
 type BestDeal = {
   id: string;
   title: string;
   image: string;
 };
 
 type TrendingDeal = {
   id: string;
   title: string;
   category: string;
   image: string;
   discountPct: number;
 };

 const CATEGORIES = ['All', 'Tech', 'Clothing', 'Home', 'Beauty'] as const;
 type Category = (typeof CATEGORIES)[number];

 export default function DealScanner() {
   const router = useRouter();

   const [query, setQuery] = useState('');
   const [activeCategory, setActiveCategory] = useState<Category>('All');
   const [liked, setLiked] = useState<Record<string, boolean>>({});

   const toggleLiked = (id: string) => {
     setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
   };

   const bestDeals: BestDeal[] = useMemo(
     () => [
       {
         id: 'bd1',
         title: 'Apple Watch',
         image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=1200&q=80',
       },
       {
         id: 'bd2',
         title: 'Headphones',
         image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
       },
       {
         id: 'bd3',
         title: '72" TV',
         image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
       },
     ],
     []
   );

   const trending: TrendingDeal[] = useMemo(
     () => [
       {
         id: 't1',
         title: 'Air Pods Pro',
         category: 'Tech',
         image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07e9d?auto=format&fit=crop&w=1200&q=80',
         discountPct: 10,
       },
       {
         id: 't5',
         title: 'Smart Watch',
         category: 'Tech',
         image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
         discountPct: 9,
       },
       {
         id: 't2',
         title: 'Hoodie',
         category: 'Clothing',
         image: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80',
         discountPct: 15,
       },
       {
         id: 't6',
         title: 'Sneakers',
         category: 'Clothing',
         image: 'https://images.unsplash.com/photo-1542291026-f7367b8c5c5?auto=format&fit=crop&w=1200&q=80',
         discountPct: 11,
       },
       {
         id: 't3',
         title: 'Vacuum Cleaner',
         category: 'Home',
         image: 'https://images.unsplash.com/photo-1581578029523-3f5b3c52db64?auto=format&fit=crop&w=1200&q=80',
         discountPct: 14,
       },
       {
         id: 't7',
         title: 'Kitchen Set',
         category: 'Home',
         image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c6d?auto=format&fit=crop&w=1200&q=80',
         discountPct: 12,
       },
       {
         id: 't4',
         title: 'Skincare Kit',
         category: 'Beauty',
         image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=80',
         discountPct: 8,
       },
       {
         id: 't8',
         title: 'Perfume',
         category: 'Beauty',
         image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
         discountPct: 7,
       },
     ],
     []
   );

   const filteredTrending = useMemo(() => {
     const byCategory = activeCategory === 'All' ? trending : trending.filter((t) => t.category === activeCategory);
     if (!query.trim()) return byCategory;
     const q = query.trim().toLowerCase();
     return byCategory.filter((t) => t.title.toLowerCase().includes(q));
   }, [activeCategory, query, trending]);

   const Header = (
     <View>
       <View style={styles.header}>
         <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => router.back()}>
           <Ionicons name="chevron-back" size={22} color="#111827" />
         </TouchableOpacity>

         <Text style={styles.headerTitle}>Deal Scanner</Text>

         <View style={styles.headerRight} />
       </View>

       <View style={styles.searchWrap}>
         <View style={styles.searchBar}>
           <Ionicons name="search" size={18} color="#6B7280" style={styles.searchIcon} />
           <TextInput
             value={query}
             onChangeText={setQuery}
             placeholder="Search Products"
             placeholderTextColor="#6B7280"
             style={styles.searchInput}
           />
           <TouchableOpacity style={styles.searchCameraButton} activeOpacity={0.85}>
             <Ionicons name="camera-outline" size={18} color="#6B7280" />
           </TouchableOpacity>
         </View>
       </View>

       <View style={styles.actionsRow}>
         <TouchableOpacity style={styles.actionPill} activeOpacity={0.85}>
           <Ionicons name="sparkles" size={18} color={BRAND_GREEN} />
           <Text style={styles.actionPillText}>AI Deal Finder</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.actionPill} activeOpacity={0.85}>
           <Ionicons name="storefront-outline" size={18} color={BRAND_GREEN} />
           <Text style={styles.actionPillText}>Compare Stores</Text>
         </TouchableOpacity>
       </View>

       <Text style={styles.sectionTitle}>Today's Best Deals</Text>
       <FlatList
         data={bestDeals}
         horizontal
         showsHorizontalScrollIndicator={false}
         keyExtractor={(item) => item.id}
         contentContainerStyle={styles.bestDealsRow}
         renderItem={({ item }) => (
           <View style={styles.bestDealCardWrap}>
             <TouchableOpacity activeOpacity={0.9} style={styles.bestDealCard}>
               <Image source={{ uri: item.image }} style={styles.bestDealImage} />
               <TouchableOpacity
                 style={[styles.heartButton, liked[item.id] ? styles.heartButtonActive : null]}
                 activeOpacity={0.85}
                 onPress={() => toggleLiked(item.id)}
               >
                 <Ionicons name={liked[item.id] ? 'heart' : 'heart-outline'} size={16} color={liked[item.id] ? '#FFFFFF' : '#6B7280'} />
               </TouchableOpacity>
             </TouchableOpacity>
             <Text style={styles.bestDealTitle}>{item.title}</Text>
           </View>
         )}
       />

       <View style={styles.trendingHeaderRow}>
         <Text style={styles.sectionTitle}>Trending Price Drops</Text>
         <TouchableOpacity style={styles.bellButton} activeOpacity={0.85}>
           <Ionicons name="notifications-outline" size={18} color="#6B7280" />
         </TouchableOpacity>
       </View>

       <FlatList
         data={CATEGORIES as unknown as string[]}
         horizontal
         keyExtractor={(c) => c}
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.chipsRow}
         renderItem={({ item }) => {
           const c = item as Category;
           const active = c === activeCategory;
           return (
             <TouchableOpacity
               activeOpacity={0.85}
               onPress={() => setActiveCategory(c)}
               style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
             >
               <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>{c}</Text>
             </TouchableOpacity>
           );
         }}
       />
     </View>
   );

   return (
     <SafeAreaView style={styles.container}>
       <FlatList
         data={filteredTrending}
         keyExtractor={(item) => item.id}
         numColumns={2}
         ListHeaderComponent={Header}
         showsVerticalScrollIndicator={false}
         contentContainerStyle={styles.listContent}
         columnWrapperStyle={styles.gridRow}
         renderItem={({ item }) => (
           <View style={styles.gridCell}>
             <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
               <Image source={{ uri: item.image }} style={styles.gridImage} />
               <View style={styles.gridBadge}>
                 <Text style={styles.gridBadgeText}>Down {item.discountPct}%</Text>
               </View>
               <TouchableOpacity
                 style={[styles.gridHeartButton, liked[item.id] ? styles.heartButtonActive : null]}
                 activeOpacity={0.85}
                 onPress={() => toggleLiked(item.id)}
               >
                 <Ionicons name={liked[item.id] ? 'heart' : 'heart-outline'} size={16} color={liked[item.id] ? '#FFFFFF' : '#6B7280'} />
               </TouchableOpacity>
             </TouchableOpacity>
           </View>
         )}
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
     height: 46,
     paddingHorizontal: 18,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
   },
   backButton: {
     width: 34,
     height: 34,
     borderRadius: 12,
     backgroundColor: '#E5E7EB',
     justifyContent: 'center',
     alignItems: 'center',
   },
   headerTitle: {
     fontSize: 16,
     fontWeight: '900',
     color: '#111827',
     letterSpacing: 0.1,
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
   },
   headerRight: {
     width: 34,
   },

   searchWrap: {
     paddingHorizontal: 18,
     paddingTop: 4,
   },
   searchBar: {
     height: 44,
     borderRadius: 999,
     backgroundColor: '#E5E7EB',
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 14,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 12 },
     shadowOpacity: 0.14,
     shadowRadius: 20,
     elevation: 10,
   },
   searchIcon: {
     marginRight: 10,
   },
   searchInput: {
     flex: 1,
     fontSize: 13,
     color: '#111827',
     fontWeight: '700',
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
   },
   searchCameraButton: {
     width: 32,
     height: 32,
     borderRadius: 16,
     justifyContent: 'center',
     alignItems: 'center',
   },

   actionsRow: {
     marginTop: 12,
     paddingHorizontal: 18,
     flexDirection: 'row',
     gap: 12,
   },
   actionPill: {
     flex: 1,
     height: 46,
     borderRadius: 14,
     backgroundColor: '#E5E7EB',
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: 8,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 12 },
     shadowOpacity: 0.12,
     shadowRadius: 18,
     elevation: 9,
   },
   actionPillText: {
     fontSize: 13,
     fontWeight: '900',
     color: '#111827',
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
   },

   sectionTitle: {
     marginTop: 16,
     paddingHorizontal: 18,
     fontSize: 16,
     fontWeight: '900',
     color: '#111827',
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
   },

   bestDealsRow: {
     paddingHorizontal: 18,
     paddingTop: 10,
     paddingBottom: 2,
     gap: 12,
   },
   bestDealCardWrap: {
     width: 128,
   },
   bestDealCard: {
     borderRadius: 16,
     backgroundColor: '#FFFFFF',
     overflow: 'hidden',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 12 },
     shadowOpacity: 0.12,
     shadowRadius: 18,
     elevation: 9,
   },
   bestDealImage: {
     width: '100%',
     height: 128,
   },
   heartButton: {
     position: 'absolute',
     right: 10,
     bottom: 10,
     width: 32,
     height: 32,
     borderRadius: 16,
     backgroundColor: '#D1D5DB',
     justifyContent: 'center',
     alignItems: 'center',
   },
   heartButtonActive: {
     backgroundColor: BRAND_GREEN,
   },
   bestDealTitle: {
     marginTop: 10,
     fontSize: 13,
     fontWeight: '800',
     color: '#111827',
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
   },

   trendingHeaderRow: {
     marginTop: 8,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingRight: 12,
   },
   bellButton: {
     width: 34,
     height: 34,
     borderRadius: 12,
     backgroundColor: '#E5E7EB',
     justifyContent: 'center',
     alignItems: 'center',
     marginTop: 16,
   },

   chipsRow: {
     paddingHorizontal: 18,
     paddingTop: 10,
     paddingBottom: 6,
     gap: 10,
   },
   chip: {
     height: 32,
     paddingHorizontal: 12,
     borderRadius: 999,
     alignItems: 'center',
     justifyContent: 'center',
   },
   chipActive: {
     backgroundColor: '#E5E7EB',
   },
   chipInactive: {
     backgroundColor: 'transparent',
   },
   chipText: {
     fontSize: 13,
     fontWeight: '800',
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
   },
   chipTextActive: {
     color: '#111827',
   },
   chipTextInactive: {
     color: '#6B7280',
   },

   gridRow: {
     paddingHorizontal: 18,
     gap: 12,
   },
   gridCell: {
     flex: 1,
     marginBottom: 12,
   },
   gridCard: {
     flex: 1,
     borderRadius: 16,
     overflow: 'hidden',
     backgroundColor: '#F3F4F6',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 14 },
     shadowOpacity: 0.14,
     shadowRadius: 20,
     elevation: 11,
   },
   gridImage: {
     width: '100%',
     height: 178,
   },
   gridBadge: {
     position: 'absolute',
     left: 10,
     top: 10,
     height: 24,
     borderRadius: 6,
     paddingHorizontal: 10,
     justifyContent: 'center',
     backgroundColor: BRAND_GREEN,
   },
   gridBadgeText: {
     fontSize: 11,
     fontWeight: '900',
     color: '#FFFFFF',
     fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
   },
   gridHeartButton: {
     position: 'absolute',
     right: 10,
     bottom: 10,
     width: 32,
     height: 32,
     borderRadius: 16,
     backgroundColor: '#D1D5DB',
     justifyContent: 'center',
     alignItems: 'center',
   },
 });
