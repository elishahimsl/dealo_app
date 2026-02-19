import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../../../lib/supabase';

const BRAND_GREEN = '#0E9F6E';
const POLICY_EFFECTIVE_DATE = 'February 19, 2025';

export default function Privacy() {
  const router = useRouter();

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(true);

  const handleDeleteData = () => {
    Alert.alert(
      'Delete My Data',
      'This will permanently delete all your saved products, scan history, and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from('saved_products').delete().eq('user_id', user.id);
                await supabase.from('user_interactions').delete().eq('user_id', user.id);
                await supabase.from('user_preferences').delete().eq('user_id', user.id);
                Alert.alert('Done', 'Your data has been deleted.');
              }
            } catch {
              Alert.alert('Error', 'Failed to delete data. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Data Controls */}
        <Text style={styles.sectionTitle}>Data Controls</Text>

        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Usage Analytics</Text>
              <Text style={styles.toggleDesc}>Help us improve DeaLo by sharing anonymous usage data</Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: '#D1D5DB', true: BRAND_GREEN }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Personalized Ads</Text>
              <Text style={styles.toggleDesc}>Show ads based on your scan and browsing history</Text>
            </View>
            <Switch
              value={personalizedAds}
              onValueChange={setPersonalizedAds}
              trackColor={{ false: '#D1D5DB', true: BRAND_GREEN }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleDeleteData}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.actionTextDanger}>Delete All My Data</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy */}
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <View style={styles.card}>
          <Text style={styles.policyDate}>Effective: {POLICY_EFFECTIVE_DATE}</Text>

          <Text style={styles.policyHeading}>1. Information We Collect</Text>
          <Text style={styles.policyBody}>
            DeaLo collects product scan data (images processed on-device and via Google Vision API), saved product preferences, price search queries, and basic account information (email, name). We do not sell your personal data.
          </Text>

          <Text style={styles.policyHeading}>2. How We Use Your Data</Text>
          <Text style={styles.policyBody}>
            We use your data to: provide product identification and price comparison results, calculate DLO scores, personalize your feed, improve our services, and display relevant advertisements via Google AdMob.
          </Text>

          <Text style={styles.policyHeading}>3. Third-Party Services</Text>
          <Text style={styles.policyBody}>
            We use Supabase (database and authentication), Google Vision API (product identification), Google Custom Search (price lookup), Google AdMob (advertising), and Amazon Associates (affiliate links). Each service has its own privacy policy.
          </Text>

          <Text style={styles.policyHeading}>4. Data Retention</Text>
          <Text style={styles.policyBody}>
            Product scans and saved items are retained until you delete them. Account data is retained until account deletion. Anonymous analytics are retained for up to 12 months.
          </Text>

          <Text style={styles.policyHeading}>5. Your Rights</Text>
          <Text style={styles.policyBody}>
            You can view, export, or delete your data at any time from this screen. You can also delete your account from Account Settings. For GDPR/CCPA requests, contact us at privacy@dealo.app.
          </Text>

          <Text style={styles.policyHeading}>6. Children's Privacy</Text>
          <Text style={styles.policyBody}>
            DeaLo is not intended for children under 13. We do not knowingly collect data from children.
          </Text>

          <Text style={styles.policyHeading}>7. Contact</Text>
          <Text style={styles.policyBody}>
            For privacy questions, email privacy@dealo.app.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.webLinkBtn}
          onPress={() => Linking.openURL('https://dealo.app/privacy')}
        >
          <Ionicons name="open-outline" size={16} color={BRAND_GREEN} />
          <Text style={styles.webLinkText}>View full policy on dealo.app</Text>
        </TouchableOpacity>

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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
    color: '#111827',
  },
  headerRightSpacer: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Manrope-Regular',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Manrope-Regular',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Manrope-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionTextDanger: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Manrope-Regular',
  },
  policyDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
    fontFamily: 'Manrope-Regular',
  },
  policyHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 14,
    marginBottom: 4,
    fontFamily: 'Manrope-Regular',
  },
  policyBody: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    fontFamily: 'Manrope-Regular',
  },
  webLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 4,
  },
  webLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_GREEN,
    fontFamily: 'Manrope-Regular',
  },
});
