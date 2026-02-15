
import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';

const FONT_REGULAR = 'Manrope-Regular';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

type RangeKey = '30d' | '90d' | 'all';

function RangePill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.rangePill, active && styles.rangePillActive]}>
      <Text style={[styles.rangeText, active && styles.rangeTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatMini({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function ListRow({ icon, text, rightText }: { icon: React.ReactNode; text: string; rightText?: string }) {
  return (
    <View style={styles.listRow}>
      <View style={styles.listRowLeft}>
        <View style={styles.listIconWrap}>{icon}</View>
        <Text style={styles.listText}>{text}</Text>
      </View>
      {rightText ? <Text style={styles.listRight}>{rightText}</Text> : null}
    </View>
  );
}

export default function InsightsScreen() {
  const router = useRouter();
  const [range, setRange] = useState<RangeKey>('90d');

  const data = useMemo(() => {
    if (range === '30d') {
      return {
        saved: 214,
        goodDeals: 6,
        avgPct: 9,
        avoided: 2,
      };
    }
    if (range === 'all') {
      return {
        saved: 1248,
        goodDeals: 34,
        avgPct: 14,
        avoided: 12,
      };
    }
    return {
      saved: 642,
      goodDeals: 18,
      avgPct: 12,
      avoided: 7,
    };
  }, [range]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.title}>Insights</Text>
          </View>
          <View style={styles.headerBtn} />
        </View>

        <View style={styles.savedCard}>
          <View style={styles.savedTop}>
            <Text style={styles.savedValue}>
              <Text style={styles.savedValueMoney}>${data.saved}</Text> Saved
            </Text>
            <Text style={styles.savedSub}>compared to average market prices</Text>
            <Text style={styles.savedHint}>Based on your comparisons & scans</Text>
          </View>

          <View style={styles.miniStatsRow}>
            <StatMini value={`${data.goodDeals}`} label={'Good Deals\nFound'} />
            <StatMini value={`${data.avgPct}%`} label={'Avg %\nSaved'} />
            <StatMini value={`${data.avoided}`} label={'Purchases\nAvoided'} />
          </View>
        </View>

        <View style={styles.personaCard}>
          <View style={styles.personaLeft}>
            <View style={styles.personaBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.personaTitle}>Value-Focused Buyer</Text>
              <Text style={styles.personaBody}>You tend to compare prices and prioritize savings over brand names.</Text>
            </View>
          </View>
        </View>

        <View style={styles.twoCardRow}>
          <View style={[styles.smallCard, styles.smallCardLeft]}>
            <Text style={styles.smallCardHeader}>Where You Save the Most</Text>
            <View style={styles.smallCardRow}>
              <View style={[styles.smallIcon, { backgroundColor: 'rgba(14,159,110,0.14)' }]}>
                <Ionicons name="laptop-outline" size={16} color={BRAND_GREEN} />
              </View>
              <Text style={styles.smallCardTitle}>Electronics</Text>
            </View>
            <Text style={styles.smallCardBody}>You save 18% more here than average.</Text>
          </View>

          <View style={[styles.smallCard, styles.smallCardRight]}>
            <Text style={styles.smallCardHeader}>Where You Overspend</Text>
            <View style={styles.smallCardRow}>
              <View style={[styles.smallIcon, { backgroundColor: 'rgba(17,24,39,0.06)' }]}>
                <Ionicons name="shirt-outline" size={16} color="#111827" />
              </View>
              <Text style={styles.smallCardTitle}>Clothing</Text>
            </View>
            <Text style={styles.smallCardBody}>You pay 9% above average here.</Text>
          </View>
        </View>

        <View style={styles.twoListRow}>
          <View style={styles.listCard}>
            <Text style={styles.listHeader}>Top Categories</Text>
            <View style={styles.listBody}>
              <ListRow icon={<Ionicons name="laptop-outline" size={16} color={BRAND_GREEN} />} text="Electronics" />
              <View style={styles.listDivider} />
              <ListRow icon={<Ionicons name="headset-outline" size={16} color={BRAND_GREEN} />} text="Audio" />
              <View style={styles.listDivider} />
              <ListRow icon={<Ionicons name="barbell-outline" size={16} color={BRAND_GREEN} />} text="Fitness" />
            </View>
          </View>

          <View style={styles.listCard}>
            <Text style={styles.listHeader}>Top Brands</Text>
            <View style={styles.listBody}>
              <ListRow icon={<Ionicons name="logo-apple" size={16} color="#111827" />} text="Apple" />
              <View style={styles.listDivider} />
              <ListRow icon={<Ionicons name="logo-playstation" size={16} color="#111827" />} text="Sony" />
              <View style={styles.listDivider} />
              <ListRow icon={<Ionicons name="navigate-outline" size={16} color="#111827" />} text="Garmin" />
            </View>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipLeft}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.tipText}>You save the most money when you check at least 3 options first.</Text>
          </View>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  headerRow: {
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
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.6,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  rangeRowWrap: {
    marginTop: 6,
    alignItems: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    padding: 4,
    gap: 6,
  },
  rangePill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rangePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  rangeTextActive: {
    color: '#111827',
  },
  savedCard: {
    marginTop: 14,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 26,
    elevation: 10,
  },
  savedTop: {
    paddingBottom: 14,
  },
  savedValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
    letterSpacing: -0.4,
  },
  savedValueMoney: {
    color: BRAND_GREEN,
  },
  savedSub: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  savedHint: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniStat: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  miniStatLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
    lineHeight: 14,
  },
  personaCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingRight: 10,
  },
  personaBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personaTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  personaBody: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
    lineHeight: 16,
  },
  twoCardRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 14,
  },
  smallCardLeft: {},
  smallCardRight: {},
  smallCardHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  smallCardRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  smallCardBody: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
    lineHeight: 16,
  },
  twoListRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  listCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  listHeader: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  listBody: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  listDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 36,
  },
  listRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  listRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 10,
    backgroundColor: 'rgba(14,159,110,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  listRight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  tipCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 10,
  },
  tipIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
    lineHeight: 16,
  },
});
