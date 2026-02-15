import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const DOT_GREEN = '#89C745';

type NotificationItem = {
  id: string;
  brand: string;
  message: string;
  timestamp: string;
  unread?: boolean;
};

const TODAY: NotificationItem[] = [
  { id: 't1', brand: 'Adidas', message: 'New deals added', timestamp: '12:14 PM', unread: true },
  { id: 't2', brand: "Santa's Uto", message: 'Restocked in Amazon, Adidas', timestamp: '7:03 AM', unread: true },
];

const FOLLOWING: NotificationItem[] = [
  { id: 'f1', brand: 'Apple', message: 'Restock updates, iPhone 17 dropped', timestamp: '1/28/26', unread: true },
  { id: 'f2', brand: 'Nike', message: "New deals, women’s shoes restocked", timestamp: '1/28/26', unread: true },
  { id: 'f3', brand: 'Walmart', message: "Premium deals on Wenda’s, New adds", timestamp: '1/13/26', unread: true },
  { id: 'f4', brand: 'NewBalance', message: 'Restocked on Track Spikes', timestamp: '1/10/26', unread: true },
];

const SAVED: NotificationItem[] = [
  { id: 's1', brand: 'AirPods Blue', message: 'Restocked', timestamp: '1/20/26', unread: true },
];

function getInitials(label: string) {
  const trimmed = label.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function NotificationRow({ item, last, insetDivider }: { item: NotificationItem; last?: boolean; insetDivider?: boolean }) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>{getInitials(item.brand)}</Text>
        </View>

        <View style={styles.rowTextCol}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {item.message}
          </Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowTime}>{item.timestamp}</Text>
          <View style={styles.unreadDotOn} />
        </View>
      </View>

      {!last ? <View style={[styles.rowDivider, insetDivider ? styles.rowDividerInset : null]} /> : null}
    </View>
  );
}

export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Today</Text>
        {TODAY.map((n) => (
          <View key={n.id} style={styles.singleCard}>
            <NotificationRow item={n} last />
          </View>
        ))}

        <Text style={styles.sectionLabel}>Following</Text>
        <View style={styles.groupCard}>
          {FOLLOWING.map((n, idx) => (
            <NotificationRow key={n.id} item={n} last={idx === FOLLOWING.length - 1} insetDivider />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Saved</Text>
        {SAVED.map((n) => (
          <View key={n.id} style={styles.singleCard}>
            <NotificationRow item={n} last />
          </View>
        ))}

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
    fontFamily: 'Manrope-Regular',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 10,
    fontFamily: 'Manrope-Regular',
  },
  singleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  rowDividerInset: {
    marginHorizontal: 16,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  rowTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
    fontFamily: 'Manrope-Regular',
  },
  rowSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  rowTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Manrope-Regular',
  },
  unreadDotOn: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DOT_GREEN,
  },
});
