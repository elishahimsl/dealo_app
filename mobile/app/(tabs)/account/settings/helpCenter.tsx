
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';

type HelpRoute =
  | 'home'
  | 'how'
  | 'deals'
  | 'scanning'
  | 'saved'
  | 'stores'
  | 'troubleshooting'
  | 'contact'
  | 'privacy'
  | 'terms';

type Qa = { q: string; a: string };

function Row({
  icon,
  title,
  onPress,
  showChevron = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
}) {
  const textPrimary = useThemeColor({}, 'textPrimary');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.row}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={[styles.rowTitle, { color: textPrimary }]}>{title}</Text>
      {showChevron ? <Ionicons name="chevron-forward" size={18} color={iconColor} /> : <View style={{ width: 18 }} />}
    </TouchableOpacity>
  );
}

function Divider({ strong = false }: { strong?: boolean }) {
  const divider = useThemeColor({}, 'divider');
  const border = useThemeColor({}, 'border');
  return <View style={[styles.divider, { backgroundColor: strong ? border : divider }]} />;
}

function QaBlock({ q, a }: Qa) {
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.qaBlock}>
      <Text style={[styles.qaQ, { color: textPrimary }]}>{q}</Text>
      <Text style={[styles.qaA, { color: textSecondary }]}>{a}</Text>
    </View>
  );
}

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  const brand = useThemeColor({}, 'brandPrimary');
  const textPrimary = useThemeColor({}, 'textPrimary');
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.primaryBtn, { backgroundColor: brand }]}>
      <Text style={[styles.primaryBtnText, { color: textPrimary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  const border = useThemeColor({}, 'border');
  const surface1 = useThemeColor({}, 'surface1');
  const brand = useThemeColor({}, 'brandPrimary');
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.secondaryBtn, { borderColor: border, backgroundColor: surface1 }]}
    >
      <Text style={[styles.secondaryBtnText, { color: brand }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function HelpCenter() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>();

  const route: HelpRoute = (() => {
    const s = params.section;
    if (
      s === 'how' ||
      s === 'deals' ||
      s === 'scanning' ||
      s === 'saved' ||
      s === 'stores' ||
      s === 'troubleshooting' ||
      s === 'contact' ||
      s === 'privacy' ||
      s === 'terms'
    ) {
      return s;
    }
    return 'home';
  })();

  const bg = useThemeColor({}, 'surface1');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const iconColor = useThemeColor({}, 'icon');
  const divider = useThemeColor({}, 'divider');

  const title = useMemo(() => {
    if (route === 'home') return 'Help Center';
    if (route === 'how') return 'How DeaLo Works';
    if (route === 'deals') return 'Deals & Analysis';
    if (route === 'scanning') return 'Scanning Products';
    if (route === 'saved') return 'Saved & Similar Items';
    if (route === 'stores') return 'Stores & Pricing';
    if (route === 'troubleshooting') return 'Troubleshooting';
    if (route === 'contact') return 'Contact & Feedback';
    if (route === 'privacy') return 'Privacy Policy';
    if (route === 'terms') return 'Terms of Service';
    return 'Help Center';
  }, [route]);

  const content: Qa[] = useMemo(() => {
    if (route === 'how') {
      return [
        {
          q: 'What is DeaLo?',
          a: 'DeaLo helps you compare products and understand value using analysis, saved items, and pricing signals. There is no cart or checkout inside the app.',
        },
        {
          q: 'How does analysis work?',
          a: 'DeaLo summarizes product strengths, tradeoffs, and pricing context. Your results are meant to help you decide, not replace your judgment.',
        },
        {
          q: 'What does a score mean?',
          a: 'Scores are a quick way to compare value based on the available data. Use the metric breakdown to understand why a product scored higher or lower.',
        },
      ];
    }

    if (route === 'deals') {
      return [
        {
          q: 'What is a “deal” in DeaLo?',
          a: 'A deal is a product option that looks favorable based on price, history, and the product’s evaluation. Deals can vary by store and time.',
        },
        {
          q: 'Why do offers change?',
          a: 'Prices can change frequently. Refresh the page or revisit later to see the most current pricing.',
        },
        {
          q: 'How do I compare two products?',
          a: 'Use Compare to select two products, then review the overall score and metric breakdown to see the tradeoffs.',
        },
      ];
    }

    if (route === 'scanning') {
      return [
        {
          q: 'How do I scan a product?',
          a: 'Open the camera tab and point it at the product or packaging. Keep the label in focus for best results.',
        },
        {
          q: 'What if scanning fails?',
          a: 'Try better lighting, move closer, and ensure the text is readable. If it still fails, search manually.',
        },
        {
          q: 'Do you change the product image?',
          a: 'No. DeaLo does not recolor product images.',
        },
      ];
    }

    if (route === 'saved') {
      return [
        {
          q: 'What can I save?',
          a: 'You can save products, scans, and comparisons to revisit later. Saved items help you stay organized while researching.',
        },
        {
          q: 'How do collections work?',
          a: 'Collections group your saved items so you can track options by category, use case, or budget.',
        },
        {
          q: 'What are similar items?',
          a: 'Similar items are alternatives that may match your needs at different prices or with different tradeoffs.',
        },
      ];
    }

    if (route === 'stores') {
      return [
        {
          q: 'Where do prices come from?',
          a: 'Prices come from available store listings and can change over time. If a store is missing, it may not have a listing available right now.',
        },
        {
          q: 'Why are prices different by store?',
          a: 'Stores set prices independently and may run promotions, bundles, or limited-time discounts.',
        },
        {
          q: 'Can I visit a store to buy?',
          a: 'Yes. Use the Visit Store button to open the store’s product page.',
        },
      ];
    }

    if (route === 'troubleshooting') {
      return [
        {
          q: 'The app looks wrong after switching themes',
          a: 'Some screens may still use light-mode colors. Try closing and reopening the screen. If it persists, contact support with a screenshot.',
        },
        {
          q: 'I cannot find a product',
          a: 'Try searching by brand + model, or scan the label if available.',
        },
        {
          q: 'Comparisons are not saving',
          a: 'Check your connection and try again. If it continues, restart the app and retry.',
        },
      ];
    }

    if (route === 'privacy') {
      return [
        {
          q: 'Privacy Policy',
          a: 'This is a placeholder policy for v1. Replace with your official Privacy Policy text or link.',
        },
        {
          q: 'Data usage',
          a: 'We use data to provide analysis and improve the app experience. Review the full policy for details.',
        },
      ];
    }

    if (route === 'terms') {
      return [
        {
          q: 'Terms of Service',
          a: 'This is a placeholder terms document for v1. Replace with your official Terms of Service text or link.',
        },
        {
          q: 'Using DeaLo',
          a: 'By using the app, you agree to the terms outlined here. Review the full text for details.',
        },
      ];
    }

    return [];
  }, [route]);

  const showHome = route === 'home';
  const showContact = route === 'contact';
  const showSection = !showHome && !showContact;

  const push = (section: Exclude<HelpRoute, 'home'>) => {
    router.push({ pathname: '/account/settings/helpCenter', params: { section } } as unknown as Href);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: divider }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>{title}</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {showHome ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.group}>
            <Row icon="information-circle-outline" title="How DeaLo Works" onPress={() => push('how')} />
            <Divider />
            <Row icon="analytics-outline" title="Deals & Analysis" onPress={() => push('deals')} />
            <Divider />
            <Row icon="scan-outline" title="Scanning Products" onPress={() => push('scanning')} />
            <Divider />
            <Row icon="bookmark-outline" title="Saved & Similar Items" onPress={() => push('saved')} />
            <Divider />
            <Row icon="pricetag-outline" title="Stores & Pricing" onPress={() => push('stores')} />
            <Divider />
            <Row icon="construct-outline" title="Troubleshooting" onPress={() => push('troubleshooting')} />
            <Divider />
            <Row icon="chatbubble-ellipses-outline" title="Contact & Feedback" onPress={() => push('contact')} />
          </View>

          <View style={styles.legalGap}>
            <Divider strong />
          </View>

          <View style={styles.group}>
            <Row icon="lock-closed-outline" title="Privacy Policy" onPress={() => push('privacy')} />
            <Divider />
            <Row icon="document-text-outline" title="Terms of Service" onPress={() => push('terms')} />
          </View>
        </ScrollView>
      ) : null}

      {showSection ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionContent}>
          {content.map((b) => (
            <QaBlock key={b.q} q={b.q} a={b.a} />
          ))}
        </ScrollView>
      ) : null}

      {showContact ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionContent}>
          <ContactAndFeedback />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

function ContactAndFeedback() {
  const textSecondary = useThemeColor({}, 'textSecondary');

  const openEmail = (subject: string) => {
    const url = `mailto:support@dealo.app?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View>
      <Text style={[styles.contactIntro, { color: textSecondary }]}>
        If you need assistance or want to share feedback, reach out below.
      </Text>

      <PrimaryButton title="Contact Support" onPress={() => openEmail('DeaLo Support')} />
      <SecondaryButton title="Send Feedback" onPress={() => openEmail('DeaLo Feedback')} />

      <View style={{ height: 20 }} />

      <QaBlock
        q="What should I include?"
        a="Include the product name, what you were doing, and what you expected to happen. Screenshots help." 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
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
  },
  headerRightSpacer: {
    width: 44,
  },

  scrollContent: {
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  group: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Manrope-Regular',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  legalGap: {
    marginVertical: 14,
  },

  sectionContent: {
    paddingTop: 14,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  qaBlock: {
    marginBottom: 22,
  },
  qaQ: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    fontFamily: 'Manrope-Regular',
  },
  qaA: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    fontFamily: 'Manrope-Regular',
  },

  contactIntro: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 18,
    fontFamily: 'Manrope-Regular',
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },
  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },
});
