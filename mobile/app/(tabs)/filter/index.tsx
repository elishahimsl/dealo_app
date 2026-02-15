import React, { useMemo, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#0E9F6E';

type Range = {
  min: number;
  max: number;
};

type TopicKey = 'recents' | 'trending' | 'mens' | 'womens' | 'sports' | 'tech' | 'home' | 'health' | 'fashion';

type Topic = {
  key: TopicKey;
  title: string;
  options: string[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMoney(n: number) {
  return `$${n.toLocaleString()}`;
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.pill, active ? styles.pillActive : null]}>
      <Text style={[styles.pillText, active ? styles.pillTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

function CheckboxBox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onToggle} style={[styles.checkBox, checked ? styles.checkBoxChecked : null]}>
      {checked ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
    </TouchableOpacity>
  );
}

function DualThumbRange({ min, max, value, onChange }: { min: number; max: number; value: Range; onChange: (r: Range) => void }) {
  const trackW = Math.min(320, Math.round(width - 48));
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  const pctMin = (value.min - min) / (max - min);
  const pctMax = (value.max - min) / (max - min);

  const xMin = clamp(Math.round(pctMin * trackW), 0, trackW);
  const xMax = clamp(Math.round(pctMax * trackW), 0, trackW);

  const moveBy = (dx: number) => {
    if (!dragging) return;

    const nextX = dragging === 'min' ? xMin + dx : xMax + dx;
    const nextPct = clamp(nextX / trackW, 0, 1);
    const raw = Math.round(min + nextPct * (max - min));
    const snapped = Math.round(raw / 10) * 10;

    if (dragging === 'min') {
      onChange({ min: Math.min(snapped, value.max - 10), max: value.max });
    } else {
      onChange({ min: value.min, max: Math.max(snapped, value.min + 10) });
    }
  };

  return (
    <View style={{ width: trackW }}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderActive, { left: Math.min(xMin, xMax), width: Math.max(0, Math.abs(xMax - xMin)) }]} />
      </View>

      <View pointerEvents="box-none" style={[styles.sliderThumbLayer, { width: trackW }]}>
        <Pressable
          onPressIn={() => setDragging('min')}
          onPressOut={() => setDragging(null)}
          onTouchMove={(e) => {
            moveBy(e.nativeEvent.locationX - xMin);
          }}
          style={[styles.sliderThumbHit, { left: xMin - 18 }]}
        >
          <View style={styles.sliderThumb} />
        </Pressable>

        <Pressable
          onPressIn={() => setDragging('max')}
          onPressOut={() => setDragging(null)}
          onTouchMove={(e) => {
            moveBy(e.nativeEvent.locationX - xMax);
          }}
          style={[styles.sliderThumbHit, { left: xMax - 18 }]}
        >
          <View style={styles.sliderThumb} />
        </Pressable>
      </View>
    </View>
  );
}

export default function FilterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = (params.returnTo ?? '').toString().trim();

  const [price, setPrice] = useState<Range>({ min: 50, max: 1000 });
  const [activeStores, setActiveStores] = useState<Record<string, boolean>>({});
  const [activeTopics, setActiveTopics] = useState<Record<string, boolean>>({});

  const stores = useMemo(() => ['Amazon', 'Nike', 'Target', 'Walmart', 'Best Buy'], []);

  const topics = useMemo<Topic[]>(
    () => [
      { key: 'recents', title: 'Recents', options: ['Recently scanned', 'Recently compared', 'Recently saved'] },
      { key: 'trending', title: 'Trending', options: ['Popular now', 'Top deals', 'Best value'] },
      { key: 'mens', title: 'Mens', options: ['Shoes', 'Hoodies', 'Accessories'] },
      { key: 'womens', title: 'Womens', options: ['Bags', 'Sweaters', 'Beauty'] },
      { key: 'sports', title: 'Sports', options: ['Running', 'Training', 'Yoga'] },
      { key: 'tech', title: 'Tech', options: ['Headphones', 'Watches', 'TVs'] },
      { key: 'home', title: 'Home', options: ['Furniture', 'Kitchen', 'Lighting'] },
      { key: 'health', title: 'Health', options: ['Recovery', 'Supplements', 'Fitness'] },
      { key: 'fashion', title: 'Fashion', options: ['Jackets', 'Tees', 'Hats'] },
    ],
    []
  );

  const reset = () => {
    setPrice({ min: 50, max: 1000 });
    setActiveStores({});
    setActiveTopics({});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.closeBtn}
          onPress={() => {
            if (returnTo) router.replace(returnTo as Href);
            else router.back();
          }}
        >
          <Ionicons name="close" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Price Range</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>{formatMoney(price.min)}</Text>
          <Text style={styles.priceValue}>{formatMoney(price.max)}</Text>
        </View>
        <DualThumbRange min={0} max={1500} value={price} onChange={setPrice} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Stores</Text>
        <View style={styles.pillsRow}>
          <Pill label="All" active={Object.keys(activeStores).length === 0} onPress={() => setActiveStores({})} />
          {stores.map((s) => (
            <Pill
              key={s}
              label={s}
              active={!!activeStores[s]}
              onPress={() => setActiveStores((prev) => ({ ...prev, [s]: !prev[s] }))}
            />
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.topicsSection]}>
        <Text style={styles.sectionLabel}>Categories</Text>

        {topics.map((t) => (
          <View key={t.key} style={styles.topicBlock}>
            <View style={styles.topicHeaderRow}>
              <Text style={styles.topicTitle}>{t.title}</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  const allKey = `${t.key}:__all__`;
                  const nextOn = !activeTopics[allKey];
                  const next: Record<string, boolean> = { ...activeTopics, [allKey]: nextOn };
                  t.options.forEach((o) => {
                    next[`${t.key}:${o}`] = nextOn;
                  });
                  setActiveTopics(next);
                }}
              >
                <Text style={styles.selectAllText}>Select all</Text>
              </TouchableOpacity>
            </View>

            {t.options.map((o) => {
              const k = `${t.key}:${o}`;
              return (
                <View key={k} style={styles.optionRow}>
                  <Text style={styles.optionText}>{o}</Text>
                  <CheckboxBox checked={!!activeTopics[k]} onToggle={() => setActiveTopics((p) => ({ ...p, [k]: !p[k] }))} />
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} style={styles.footerBtnSecondary} onPress={reset}>
          <Text style={styles.footerBtnSecondaryText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.footerBtnPrimary}
          onPress={() => {
            if (returnTo) router.replace(returnTo as Href);
            else router.back();
          }}
        >
          <Text style={styles.footerBtnPrimaryText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    opacity: 0.75,
    marginBottom: 10,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(17,24,39,0.18)',
  },
  sliderActive: {
    position: 'absolute',
    top: 0,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  sliderThumbLayer: {
    position: 'absolute',
    top: -18,
    height: 40,
  },
  sliderThumbHit: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.12)',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },

  topicsSection: {
    paddingBottom: 110,
  },
  topicBlock: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.06)',
  },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(17,24,39,0.06)',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    opacity: 0.82,
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxChecked: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Platform.select({ ios: 22, android: 18, default: 18 }),
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F5F2ED',
    borderTopWidth: 1,
    borderTopColor: 'rgba(17,24,39,0.06)',
  },
  footerBtnSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnSecondaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  footerBtnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnPrimaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
