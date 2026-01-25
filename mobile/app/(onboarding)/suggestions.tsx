import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#2D4B17';
const CARD_OFF = '#6B7280';
const CARD_ON = '#4E8D2C';

type Item = {
  id: string;
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
};

function HeartCard({ item, selected, onToggle, size }: { item: Item; selected: boolean; onToggle: () => void; size: { w: number; h: number } }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.card, { width: size.w, height: size.h }, selected ? styles.cardOn : styles.cardOff]}
    >
      <View style={styles.heartWrap}>
        <Ionicons name={selected ? 'heart' : 'heart-outline'} size={18} color={selected ? '#FFFFFF' : '#111111'} />
      </View>

      <View style={styles.cardCenter}>
        {item.icon ? (
          <Ionicons name={item.icon} size={44} color={selected ? '#FFFFFF' : '#111111'} />
        ) : (
          <Text style={[styles.cardInitial, selected ? styles.cardInitialOn : styles.cardInitialOff]}>{item.label.slice(0, 1)}</Text>
        )}
      </View>

      <Text style={styles.cardLabel}>{item.label}</Text>
    </Pressable>
  );
}

function TwoRowHorizontal({
  title,
  items,
  selected,
  onToggle,
  cardSize,
}: {
  title: string;
  items: Item[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  cardSize: { w: number; h: number };
}) {
  const cols = Math.ceil(items.length / 2);
  const topRow = items.slice(0, cols);
  const bottomRow = items.slice(cols);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent}>
        {topRow.map((topItem, idx) => {
          const bottomItem = bottomRow[idx];
          return (
            <View key={topItem.id} style={styles.column}>
              <HeartCard
                item={topItem}
                selected={selected.has(topItem.id)}
                onToggle={() => onToggle(topItem.id)}
                size={cardSize}
              />
              {bottomItem ? (
                <HeartCard
                  item={bottomItem}
                  selected={selected.has(bottomItem.id)}
                  onToggle={() => onToggle(bottomItem.id)}
                  size={cardSize}
                />
              ) : (
                <View style={{ width: cardSize.w, height: cardSize.h }} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function SuggestionsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const brands: Item[] = useMemo(
    () => [
      { id: 'brand-apple', label: 'Apple', icon: 'logo-apple' },
      { id: 'brand-adidas', label: 'Adidas' },
      { id: 'brand-nike', label: 'Nike' },
      { id: 'brand-hm', label: 'H&M' },
      { id: 'brand-north-face', label: 'North Face' },
      { id: 'brand-zara', label: 'Zara' },
      { id: 'brand-gap', label: 'GAP' },
      { id: 'brand-puma', label: 'Puma' },
      { id: 'brand-uniqlo', label: 'Uniqlo' },
    ],
    [],
  );

  const stores: Item[] = useMemo(
    () => [
      { id: 'store-target', label: 'Target' },
      { id: 'store-amazon', label: 'Amazon' },
      { id: 'store-walmart', label: 'Walmart' },
      { id: 'store-bestbuy', label: 'Best Buy' },
      { id: 'store-kohls', label: "Kohl's" },
      { id: 'store-costco', label: 'Costco' },
    ],
    [],
  );

  const topics: Item[] = useMemo(
    () => [
      { id: 'topic-tech', label: 'Tech' },
      { id: 'topic-fashion', label: 'Fashion' },
      { id: 'topic-home', label: 'Home' },
      { id: 'topic-fitness', label: 'Fitness' },
      { id: 'topic-beauty', label: 'Beauty' },
      { id: 'topic-gaming', label: 'Gaming' },
      { id: 'topic-pets', label: 'Pets' },
      { id: 'topic-kids', label: 'Kids' },
    ],
    [],
  );

  const { width } = Dimensions.get('window');
  const pagePad = 18;
  const gap = 12;
  const brandCardW = Math.floor((width - pagePad * 2 - gap * 2) / 3);
  const brandCardH = 132;
  const smallCard = { w: brandCardW, h: 92 };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Pressable hitSlop={10} onPress={() => router.replace('/(tabs)/home/index' as Href)} style={styles.skipBtn}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Let’s find what{`\n`}you’re interested in</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Brands</Text>
          <View style={styles.brandGrid}>
            {brands.map((b) => (
              <HeartCard
                key={b.id}
                item={b}
                selected={selected.has(b.id)}
                onToggle={() => toggle(b.id)}
                size={{ w: brandCardW, h: brandCardH }}
              />
            ))}
          </View>
        </View>

        <TwoRowHorizontal title="Explore Stores" items={stores} selected={selected} onToggle={toggle} cardSize={smallCard} />
        <TwoRowHorizontal title="Topics" items={topics} selected={selected} onToggle={toggle} cardSize={smallCard} />

        <View style={styles.bottomCtaWrap}>
          <Pressable style={styles.primaryCta} onPress={() => router.replace('/(tabs)/home/index' as Href)}>
            <Text style={styles.primaryCtaText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 22,
  },
  headerRow: {
    height: 34,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skip: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.85,
  },
  title: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 34,
    marginBottom: 22,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 12,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hScrollContent: {
    gap: 12,
    paddingRight: 18,
  },
  column: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 12,
    justifyContent: 'space-between',
  },
  cardOff: {
    backgroundColor: CARD_OFF,
    opacity: 0.85,
  },
  cardOn: {
    backgroundColor: CARD_ON,
  },
  heartWrap: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInitial: {
    fontSize: 38,
    fontWeight: '900',
  },
  cardInitialOff: {
    color: '#111111',
  },
  cardInitialOn: {
    color: '#FFFFFF',
  },
  cardLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomCtaWrap: {
    marginTop: 8,
  },
  primaryCta: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
