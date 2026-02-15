import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_GAP = 12;
const CARD_W = (SCREEN_W - 18 * 2 - GRID_GAP) / 2;

type Reward = {
  id: string;
  name: string;
  cost: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
};

const REWARDS: Reward[] = [
  { id: '1', name: '+5 Extra Comparisons', cost: 100, icon: 'swap-horizontal-outline', color: BRAND_GREEN, bg: '#ECFDF5' },
  { id: '2', name: '3-Day Premium Trial', cost: 250, icon: 'rocket-outline', color: '#8B5CF6', bg: '#EDE9FE' },
  { id: '3', name: 'Ad-Free for 24h', cost: 150, icon: 'eye-off-outline', color: '#F59E0B', bg: '#FEF3C7' },
  { id: '4', name: 'Exclusive Badge', cost: 500, icon: 'ribbon-outline', color: '#EC4899', bg: '#FCE7F3' },
  { id: '5', name: 'Priority Support', cost: 200, icon: 'flash-outline', color: '#3B82F6', bg: '#DBEAFE' },
  { id: '6', name: 'Mystery Reward', cost: 300, icon: 'help-circle-outline', color: '#111827', bg: '#F3F4F6' },
];

function RewardCard({ reward, balance, onRedeem }: { reward: Reward; balance: number; onRedeem: () => void }) {
  const canAfford = balance >= reward.cost;

  return (
    <TouchableOpacity
      activeOpacity={canAfford ? 0.85 : 1}
      style={[styles.card, !canAfford && styles.cardLocked]}
      onPress={canAfford ? onRedeem : undefined}
    >
      <View style={[styles.cardIcon, { backgroundColor: canAfford ? reward.bg : '#F3F4F6' }]}>
        <Ionicons name={reward.icon} size={24} color={canAfford ? reward.color : '#9CA3AF'} />
      </View>
      <Text style={[styles.cardName, !canAfford && styles.cardNameLocked]} numberOfLines={2}>
        {reward.name}
      </Text>
      <View style={[styles.costPill, canAfford ? { backgroundColor: '#111827' } : { backgroundColor: '#E5E7EB' }]}>
        <Ionicons name="sparkles" size={11} color={canAfford ? '#FFFFFF' : '#9CA3AF'} />
        <Text style={[styles.costText, !canAfford && styles.costTextLocked]}>{reward.cost} pts</Text>
      </View>
      {!canAfford && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function RedeemRewardsScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(350);

  const onRedeem = (reward: Reward) => {
    Alert.alert(
      'Redeem reward',
      `Spend ${reward.cost} pts on "${reward.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            setBalance((b) => b - reward.cost);
            Alert.alert('Redeemed!', `You unlocked "${reward.name}".`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Redeem Rewards</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Balance Bar */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceLeft}>
          <View style={styles.balanceIcon}>
            <Ionicons name="sparkles" size={18} color={BRAND_GREEN} />
          </View>
          <View>
            <Text style={styles.balanceLabel}>Your balance</Text>
            <Text style={styles.balanceValue}>{balance} pts</Text>
          </View>
        </View>
      </View>

      {/* Rewards Grid */}
      <FlatList
        data={REWARDS}
        numColumns={2}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RewardCard reward={item} balance={balance} onRedeem={() => onRedeem(item)} />
        )}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
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
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },

  /* Balance */
  balanceCard: {
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },

  /* Grid */
  grid: {
    paddingHorizontal: 18,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },

  /* Card */
  card: {
    width: CARD_W,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
    position: 'relative',
  },
  cardLocked: {
    opacity: 0.55,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 17,
    fontFamily: Platform.OS === 'android' ? undefined : FONT_SEMI,
  },
  cardNameLocked: {
    color: '#9CA3AF',
  },
  costPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
  },
  costText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? undefined : FONT_BOLD,
  },
  costTextLocked: {
    color: '#9CA3AF',
  },
  lockOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});