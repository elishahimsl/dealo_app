import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useAccountProfile } from '../_layout';

const { width } = Dimensions.get('window');

export default function Account() {
  const router = useRouter();
  const { profile } = useAccountProfile();
  const userName = profile.name;
  const hasName = userName.trim().length > 0;
  const BRAND_GREEN = '#0E9F6E';

  const initial = (() => {
    const trimmed = userName.trim();
    if (!trimmed) return '';
    const first = trimmed.split(' ')[0]?.trim() ?? '';
    return first[0]?.toUpperCase() ?? '';
  })();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.upgradeHeaderButton} activeOpacity={0.9}>
            <Ionicons name="rocket-outline" size={18} color="#FFFFFF" />
            <Text style={styles.upgradeHeaderText}>Upgrade</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/account/settings' as Href)}>
              <Ionicons name="settings-outline" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Icon and Upgrade */}
        <View style={styles.accountSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {initial ? (
                <Text style={[styles.avatarInitial, { color: BRAND_GREEN }]}>{initial}</Text>
              ) : (
                <Ionicons name="person-outline" size={40} color="#111827" />
              )}
            </View>
          </View>
        </View>

        {/* Name and Manage Account */}
        <View style={styles.nameSection}>
          {hasName ? <Text style={styles.userName}>{userName}</Text> : null}
          <TouchableOpacity style={styles.manageAccountButton} activeOpacity={0.85} onPress={() => router.push('/account/manageAccount' as Href)}>
            <Text style={[styles.manageAccountText, { color: BRAND_GREEN }]}>Manage account</Text>
            <Ionicons name="chevron-forward" size={16} color={BRAND_GREEN} />
          </TouchableOpacity>
        </View>

        {/* Standard Member Tile */}
        <View style={styles.memberTile}>
          <View style={styles.memberContent}>
            <Ionicons name="person-outline" size={20} color="#111827" />
            <View style={styles.memberText}>
              <Text style={styles.memberTitle}>Standard member</Text>
            </View>
          </View>
        </View>

        {/* Two Tiles Row */}
        <View style={styles.twoTilesRow}>
          <TouchableOpacity style={styles.insightTile}>
            <Ionicons name="stats-chart-outline" size={24} color={BRAND_GREEN} />
            <Text style={styles.insightTileText}>Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentTile}>
            <Ionicons name="time-outline" size={24} color="#111827" />
            <Text style={styles.recentTileText}>Recents</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help</Text>
          <View style={styles.lineList}>
            <TouchableOpacity style={styles.lineRow} activeOpacity={0.85}>
              <Ionicons name="help-circle-outline" size={20} color="#111827" />
              <Text style={styles.lineText}>Help Center</Text>
            </TouchableOpacity>
            <View style={styles.lineDivider} />
            <TouchableOpacity style={styles.lineRow} activeOpacity={0.85}>
              <Ionicons name="chatbubble-outline" size={20} color="#111827" />
              <Text style={styles.lineText}>Contact Support</Text>
            </TouchableOpacity>
            <View style={styles.lineDivider} />
            <TouchableOpacity style={styles.lineRow} activeOpacity={0.85}>
              <Ionicons name="create-outline" size={20} color="#111827" />
              <Text style={styles.lineText}>Customer feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.lineList}>
            <TouchableOpacity style={styles.lineRow} activeOpacity={0.85}>
              <Ionicons name="share-social-outline" size={20} color="#111827" />
              <Text style={styles.lineText}>Share DeaLo</Text>
            </TouchableOpacity>
            <View style={styles.lineDivider} />
            <TouchableOpacity style={styles.lineRow} activeOpacity={0.85}>
              <Ionicons name="gift-outline" size={20} color="#111827" />
              <Text style={styles.lineText}>Earn benefits</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  upgradeHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E9F6E',
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  upgradeHeaderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  accountSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  upgradeButton: {
    backgroundColor: '#0E9F6E',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  nameSection: {
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  manageAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  manageAccountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  threeTilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  actionTile: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionTileText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  memberTile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberText: {
    marginLeft: 12,
  },
  memberTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  memberSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  twoTilesRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginBottom: 24,
    gap: 12,
  },
  insightTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  insightTileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  recentTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  recentTileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  lineList: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEF2F7',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 14,
    gap: 12,
  },
  lineText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  lineDivider: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginLeft: 16,
  },
  section: {
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  rewardsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  rewardsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  rewardLabel: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});
