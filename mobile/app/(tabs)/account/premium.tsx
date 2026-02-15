
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND_GREEN = '#0E9F6E';
const { width: SCREEN_W } = Dimensions.get('window');
const PAGE_SIDE = 18;
const PAGE_W = SCREEN_W - PAGE_SIDE * 2;

type PlanKey = 'standard' | 'premium';

const FONT_REGULAR = 'Manrope-Regular';
const FONT_SEMI = 'Manrope-SemiBold';
const FONT_BOLD = 'Manrope-Bold';

function Segmented({ value, onChange }: { value: PlanKey; onChange: (v: PlanKey) => void }) {
  return (
    <View style={styles.segmentWrap}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onChange('standard')}
        style={[styles.segmentItem, value === 'standard' && styles.segmentItemActive]}
      >
        <Text style={[styles.segmentText, value === 'standard' && styles.segmentTextActive]}>Standard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onChange('premium')}
        style={[styles.segmentItem, value === 'premium' && styles.segmentItemActive]}
      >
        <Text style={[styles.segmentText, value === 'premium' && styles.segmentTextActive]}>Premium</Text>
      </TouchableOpacity>
    </View>
  );
}

function FeatureRow({ text, tone }: { text: string; tone?: 'green' | 'gray' }) {
  const bg = tone === 'gray' ? '#E5E7EB' : '#D1FAE5';
  const icon = tone === 'gray' ? '#6B7280' : BRAND_GREEN;
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureDot, { backgroundColor: bg }]}>
        <Ionicons name="checkmark" size={12} color={icon} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function PlanCard({
  title,
  subtitle,
  features,
  cta,
  active,
  tone,
}: {
  title: string;
  subtitle: string;
  features: string[];
  cta: string;
  active: boolean;
  tone: 'standard' | 'premium';
}) {
  const headerIconBg = tone === 'premium' ? '#D1FAE5' : '#E5E7EB';
  const headerIconColor = tone === 'premium' ? BRAND_GREEN : '#6B7280';

  return (
    <View style={[styles.planCardOuter, { width: PAGE_W }]}>
      <View style={[styles.planCard, tone === 'premium' && styles.planCardPremium, active && styles.planCardActive]}>
        <View style={styles.planHeaderRow}>
          <View style={[styles.planIcon, { backgroundColor: headerIconBg }]}>
            <Ionicons name="checkmark" size={18} color={headerIconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.planTitle}>{title}</Text>
            <Text style={styles.planSubtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.planFeatures}>
          {features.map((f) => (
            <FeatureRow key={f} text={f} tone={tone === 'premium' ? 'green' : 'gray'} />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} style={[styles.planCta, tone === 'premium' && styles.planCtaPremium]}>
          <Text style={[styles.planCtaText, tone === 'premium' && styles.planCtaTextPremium]}>{cta}</Text>
          <Ionicons name="arrow-forward" size={18} color={tone === 'premium' ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PremiumScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const [plan, setPlan] = useState<PlanKey>('standard');
  const [idea, setIdea] = useState('');

  const standardFeatures = useMemo(() => ['Limited comparisons', 'Daily scan limits', 'Popular tools'], []);
  const premiumFeatures = useMemo(() => ['Unlimited scans', 'Unlimited comparisons', 'Improved AI', 'Featured tools'], []);

  const scrollToPlan = useCallback((p: PlanKey) => {
    const idx = p === 'standard' ? 0 : 1;
    scrollRef.current?.scrollTo({ x: idx * PAGE_W, animated: true });
  }, []);

  const onChangePlan = useCallback(
    (p: PlanKey) => {
      setPlan(p);
      scrollToPlan(p);
    },
    [scrollToPlan]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.page}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Select plan</Text>
          </View>
          <View style={styles.headerRightSpace} />
        </View>

        <View style={styles.segmentRow}>
          <Segmented value={plan} onChange={onChangePlan} />
        </View>

        <ScrollView
          ref={(r) => {
            scrollRef.current = r;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={PAGE_W}
          disableIntervalMomentum
          contentContainerStyle={styles.planCarousel}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / PAGE_W);
            setPlan(idx === 0 ? 'standard' : 'premium');
          }}
        >
          <PlanCard
            title="Standard"
            subtitle="Basic features, no cost"
            features={standardFeatures}
            cta="Standard"
            active={plan === 'standard'}
            tone="standard"
          />
          <PlanCard
            title="Premium"
            subtitle="All features unlocked"
            features={premiumFeatures}
            cta="Premium"
            active={plan === 'premium'}
            tone="premium"
          />
        </ScrollView>

        <View style={styles.helpBlock}>
          <Text style={styles.helpTitle}>Help Shape Premium</Text>
          <Text style={styles.helpSubtitle}>What premium features matter most to you?</Text>

          <View style={styles.ideaRow}>
            <TextInput
              value={idea}
              onChangeText={setIdea}
              placeholder="I'd love Premium to include..."
              placeholderTextColor="#9CA3AF"
              style={styles.ideaInput}
            />
            <TouchableOpacity activeOpacity={0.9} style={styles.ideaSend}>
              <Ionicons name="paper-plane" size={18} color={BRAND_GREEN} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.waitlistBtn}>
            <Text style={styles.waitlistText}>Join the waitlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  page: {
    flex: 1,
    paddingBottom: 110,
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
    fontFamily: FONT_BOLD,
  },
  headerRightSpace: {
    width: 40,
  },
  segmentRow: {
    paddingHorizontal: 18,
    marginTop: 10,
  },
  segmentWrap: {
    height: 44,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: FONT_SEMI,
  },
  segmentTextActive: {
    color: '#111827',
  },
  planCarousel: {
    paddingLeft: PAGE_SIDE,
    paddingRight: PAGE_SIDE,
    marginTop: 12,
  },
  planCardOuter: {
    paddingRight: 14,
  },
  planCard: {
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.86)',
    padding: 18,
    minHeight: 342,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.10,
    shadowRadius: 30,
    elevation: 12,
    overflow: 'hidden',
  },
  planCardPremium: {
    minHeight: 342,
  },
  planCardActive: {
    borderColor: 'rgba(0,0,0,0.05)',
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 14,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#111827',
    fontFamily: FONT_BOLD,
  },
  planSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: FONT_REGULAR,
  },
  planFeatures: {
    marginTop: 18,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONT_SEMI,
  },
  planCta: {
    marginTop: 20,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  planCtaPremium: {
    backgroundColor: BRAND_GREEN,
  },
  planCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    fontFamily: FONT_BOLD,
  },
  planCtaTextPremium: {
    color: '#FFFFFF',
  },
  helpBlock: {
    paddingHorizontal: 18,
    marginTop: 6,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONT_SEMI,
  },
  helpSubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: FONT_REGULAR,
  },
  ideaRow: {
    marginTop: 10,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ideaInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONT_SEMI,
  },
  ideaSend: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  waitlistBtn: {
    marginTop: 10,
    height: 54,
    borderRadius: 999,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 22,
    elevation: 10,
  },
  waitlistText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: FONT_BOLD,
  },
});
