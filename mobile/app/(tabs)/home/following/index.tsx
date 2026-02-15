import React from 'react';
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
import { useRouter } from 'expo-router';

type BrandRow = {
  id: string;
  name: string;
  domain: string;
  status: string;
};

const FOLLOWING: BrandRow[] = [
  { id: 'nike', name: 'Nike', domain: 'nike.com', status: 'New ads this week' },
  { id: 'adidas', name: 'Adidas', domain: 'adidas.com', status: 'New drop available' },
  { id: 'target', name: 'Target', domain: 'target.com', status: 'More products you may like' },
];

const SUGGESTED: BrandRow[] = [
  { id: 'apple', name: 'Apple', domain: 'apple.com', status: 'Restock updates' },
  { id: 'bestbuy', name: 'Best Buy', domain: 'bestbuy.com', status: 'New deals this week' },
  { id: 'walmart', name: 'Walmart', domain: 'walmart.com', status: 'New drops available' },
];

export default function Following() {
  const router = useRouter();

  const renderBrandRow = ({ item }: ListRenderItemInfo<BrandRow>) => {
    return (
      <View style={styles.row}>
        <View style={styles.logoWrap}>
          <Image source={{ uri: `https://logo.clearbit.com/${item.domain}` }} style={styles.logo} />
        </View>

        <View style={styles.rowText}>
          <Text style={styles.brandName}>{item.name}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.pill}>
          <Text style={styles.pillText}>Following</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={FOLLOWING}
        keyExtractor={(i) => i.id}
        renderItem={renderBrandRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Following</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.manageBtn}>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View style={styles.suggestedBlock}>
            <Text style={styles.sectionTitle}>Suggested brands to follow</Text>
            {SUGGESTED.map((b) => (
              <View key={b.id} style={styles.row}>
                <View style={styles.logoWrap}>
                  <Image source={{ uri: `https://logo.clearbit.com/${b.domain}` }} style={styles.logo} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.brandName}>{b.name}</Text>
                  <Text style={styles.statusText}>{b.status}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.85} style={styles.followPill}>
                  <Text style={styles.followPillText}>Follow</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },
  manageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  manageText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  suggestedBlock: {
    paddingTop: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  logoWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  logo: {
    width: 26,
    height: 14,
    resizeMode: 'contain',
  },
  rowText: {
    flex: 1,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  pill: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  followPill: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
});
