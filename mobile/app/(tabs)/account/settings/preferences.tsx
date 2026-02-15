import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useThemeColor } from '@/hooks/use-theme-color';

type DecisionStyle = 'quality' | 'balanced' | 'price';
type DealView = 'bestOverall' | 'lowestPrice' | 'bestValue' | 'mostTrusted' | 'mostPopular';
type AnalysisLayout = 'full' | 'compact';
type ComparePriority = 'bestValue' | 'lowestPrice' | 'bestQuality' | 'mostFeatures' | 'mostTrustedBrand';

type Prefs = {
  favoriteBrands: string[];
  preferredStores: string[];
  styleTags: string[];
  decisionStyle: DecisionStyle;

  analysisDefaultDealView: DealView;
  analysisAutoExpandPriceHistory: boolean;
  analysisAutoExpandOtherStores: boolean;
  analysisLayout: AnalysisLayout;
  analysisShortExplanation: boolean;

  comparePriority: ComparePriority;
  compareAutoExpandTradeoffs: boolean;
  compareEmphasizeWinner: boolean;

  displaySkipProductSheet: boolean;
  displayAutoLoadSimilar: boolean;
  displayReduceDataUsage: boolean;
};

const STORAGE_KEY = 'dealo.preferences.v1';

const DEFAULT_PREFS: Prefs = {
  favoriteBrands: [],
  preferredStores: [],
  styleTags: [],
  decisionStyle: 'balanced',

  analysisDefaultDealView: 'bestOverall',
  analysisAutoExpandPriceHistory: false,
  analysisAutoExpandOtherStores: true,
  analysisLayout: 'full',
  analysisShortExplanation: true,

  comparePriority: 'bestValue',
  compareAutoExpandTradeoffs: true,
  compareEmphasizeWinner: true,

  displaySkipProductSheet: false,
  displayAutoLoadSimilar: true,
  displayReduceDataUsage: false,
};

const BRAND_OPTIONS = [
  'Nike',
  'Adidas',
  'Puma',
  'New Balance',
  'Under Armour',
  'Apple',
  'Samsung',
  'Sony',
  'Bose',
  'JBL',
  'Dyson',
  'Shark',
  'Levi\'s',
  'Uniqlo',
  'Zara',
  'H\u0026M',
  'Patagonia',
  'The North Face',
  'Lululemon',
  'Reebok',
  'Converse',
  'Vans',
  'Coach',
  'Gucci',
  'IKEA',
  'Philips',
  'KitchenAid',
  'Cuisinart',
  'Ninja',
  'Instant',
];

const STORE_OPTIONS = [
  'Amazon',
  'Walmart',
  'Target',
  'Best Buy',
  'Costco',
  'eBay',
  'Home Depot',
  'Lowe\'s',
  'REI',
  'Nordstrom',
  'Macy\'s',
  'Sephora',
  'Ulta',
  'Newegg',
  'Apple Store',
  'Samsung Store',
];

const STYLE_TAGS = [
  'Minimal',
  'Sporty',
  'Streetwear',
  'Premium',
  'Budget-friendly',
  'Trend-forward',
  'Sustainable',
  'Classic',
  'Work/Office',
  'Casual',
];

type Page =
  | 'main'
  | 'brands'
  | 'stores'
  | 'styles'
  | 'dealView'
  | 'analysisLayout'
  | 'comparePriority';

function normalizePrefs(input: any): Prefs {
  const candidate = typeof input === 'object' && input ? input : {};
  return {
    ...DEFAULT_PREFS,
    ...candidate,
    favoriteBrands: Array.isArray(candidate.favoriteBrands) ? candidate.favoriteBrands : DEFAULT_PREFS.favoriteBrands,
    preferredStores: Array.isArray(candidate.preferredStores) ? candidate.preferredStores : DEFAULT_PREFS.preferredStores,
    styleTags: Array.isArray(candidate.styleTags) ? candidate.styleTags : DEFAULT_PREFS.styleTags,
  };
}

function formatSelectionSummary(items: string[]) {
  if (!items.length) return 'None';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]}, ${items[1]}`;
  return `${items.length}`;
}

function Header({ title, saved, onBack }: { title: string; saved?: boolean; onBack: () => void }) {
  const textPrimary = useThemeColor({}, 'textPrimary');
  const iconDefault = useThemeColor({}, 'icon');
  const brandPrimary = useThemeColor({}, 'brandPrimary');
  const border = useThemeColor({}, 'border');
  const surface2 = useThemeColor({}, 'surface2');

  return (
    <View style={styles.header}>
      <TouchableOpacity activeOpacity={0.85} onPress={onBack} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} color={iconDefault} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: textPrimary }]}>{title}</Text>
      <View style={styles.headerRight}>
        {saved ? (
          <View style={[styles.savedPill, { backgroundColor: surface2, borderColor: border }]}>
            <Text style={[styles.savedText, { color: brandPrimary }]}>Saved</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  const textMuted = useThemeColor({}, 'textMuted');
  return <Text style={[styles.sectionLabel, { color: textMuted }]}>{title}</Text>;
}

function Group({ children }: { children: React.ReactNode }) {
  const surface1 = useThemeColor({}, 'surface1');
  const border = useThemeColor({}, 'border');
  return <View style={[styles.group, { backgroundColor: surface1, borderColor: border }]}>{children}</View>;
}

function Separator() {
  const divider = useThemeColor({}, 'divider');
  return <View style={[styles.sep, { backgroundColor: divider }]} />;
}

function Row({
  title,
  subtitle,
  value,
  onPress,
  disabled,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const iconDefault = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!!disabled}
      style={[styles.row, disabled ? styles.rowDisabled : null]}
    >
      <View style={styles.rowLeft}>
        <Text style={[styles.rowTitle, { color: textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSubtitle, { color: textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={[styles.rowValue, { color: textSecondary }]} numberOfLines={1}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={iconDefault} />
      </View>
    </TouchableOpacity>
  );
}

function ToggleRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const brandPrimary = useThemeColor({}, 'brandPrimary');
  const border = useThemeColor({}, 'border');

  return (
    <View style={[styles.row, disabled ? styles.rowDisabled : null]}>
      <View style={styles.rowLeft}>
        <Text style={[styles.rowTitle, { color: textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSubtitle, { color: textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={!!disabled}
        trackColor={{ false: border, true: brandPrimary }}
      />
    </View>
  );
}

function Segmented3({
  value,
  onChange,
  left,
  center,
  right,
}: {
  value: string;
  onChange: (next: string) => void;
  left: { id: string; label: string };
  center: { id: string; label: string };
  right: { id: string; label: string };
}) {
  const border = useThemeColor({}, 'border');
  const surface2 = useThemeColor({}, 'surface2');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const Btn = useCallback(
    ({ id, label, pos }: { id: string; label: string; pos: 'left' | 'mid' | 'right' }) => {
      const selected = value === id;
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onChange(id)}
          style={[
            styles.segBtn,
            pos === 'left' ? styles.segLeft : null,
            pos === 'right' ? styles.segRight : null,
            { borderColor: border, backgroundColor: selected ? surface2 : 'transparent' },
          ]}
        >
          <Text style={[styles.segText, { color: selected ? textPrimary : textSecondary }]}>{label}</Text>
        </TouchableOpacity>
      );
    },
    [border, onChange, surface2, textPrimary, textSecondary, value]
  );

  return (
    <View style={[styles.segWrap, { borderColor: border }]}>
      <Btn id={left.id} label={left.label} pos="left" />
      <Btn id={center.id} label={center.label} pos="mid" />
      <Btn id={right.id} label={right.label} pos="right" />
    </View>
  );
}

export default function Preferences() {
  const router = useRouter();
  const params = useLocalSearchParams<{ page?: string }>();

  const page: Page =
    params.page === 'brands' ||
    params.page === 'stores' ||
    params.page === 'styles' ||
    params.page === 'dealView' ||
    params.page === 'analysisLayout' ||
    params.page === 'comparePriority'
      ? (params.page as Page)
      : 'main';

  const bg = useThemeColor({}, 'bgPrimary');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);
  const savedTimer = useRef<any>(null);

  const pulseSaved = useCallback(() => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setSavedPulse(true);
    savedTimer.current = setTimeout(() => setSavedPulse(false), 900);
  }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        if (!raw) {
          setPrefs(DEFAULT_PREFS);
          setLoaded(true);
          return;
        }
        try {
          setPrefs(normalizePrefs(JSON.parse(raw)));
        } catch {
          setPrefs(DEFAULT_PREFS);
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!mounted) return;
        setPrefs(DEFAULT_PREFS);
        setLoaded(true);
      });
    return () => {
      mounted = false;
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const persist = useCallback((next: Prefs, opts?: { pulseSaved?: boolean }) => {
    setPrefs(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    if (opts?.pulseSaved) pulseSaved();
  }, [pulseSaved]);

  const update = useCallback(
    (patch: Partial<Prefs>, opts?: { pulseSaved?: boolean }) => {
      persist({ ...prefs, ...patch }, opts);
    },
    [persist, prefs]
  );

  const pushPage = useCallback(
    (p: Exclude<Page, 'main'>) => {
      router.push({ pathname: '/account/settings/preferences', params: { page: p } } as unknown as Href);
    },
    [router]
  );

  const title = useMemo(() => {
    if (page === 'main') return 'Preferences';
    if (page === 'brands') return 'Favorite Brands';
    if (page === 'stores') return 'Preferred Stores';
    if (page === 'styles') return 'Style Preferences';
    if (page === 'dealView') return 'Default Deal View';
    if (page === 'analysisLayout') return 'Analysis Layout';
    if (page === 'comparePriority') return 'Compare Priority';
    return 'Preferences';
  }, [page]);

  const dealViewLabel = useMemo(() => {
    const v = prefs.analysisDefaultDealView;
    if (v === 'bestOverall') return 'Best Overall';
    if (v === 'lowestPrice') return 'Lowest Price';
    if (v === 'bestValue') return 'Best Value';
    if (v === 'mostTrusted') return 'Most Trusted Store';
    if (v === 'mostPopular') return 'Most Popular';
    return 'Best Overall';
  }, [prefs.analysisDefaultDealView]);

  const analysisLayoutLabel = prefs.analysisLayout === 'compact' ? 'Compact' : 'Full Detail';
  const comparePriorityLabel = useMemo(() => {
    const v = prefs.comparePriority;
    if (v === 'bestValue') return 'Best Value';
    if (v === 'lowestPrice') return 'Lowest Price';
    if (v === 'bestQuality') return 'Best Quality';
    if (v === 'mostFeatures') return 'Most Features';
    if (v === 'mostTrustedBrand') return 'Most Trusted Brand';
    return 'Best Value';
  }, [prefs.comparePriority]);

  const decisionStyleValue = useMemo(() => {
    if (prefs.decisionStyle === 'quality') return 'Quality';
    if (prefs.decisionStyle === 'price') return 'Lowest Price';
    return 'Balanced';
  }, [prefs.decisionStyle]);

  const reduceDataUsage = prefs.displayReduceDataUsage;

  const setReduceDataUsage = useCallback(
    (next: boolean) => {
      if (!next) {
        update({ displayReduceDataUsage: false });
        return;
      }
      update({
        displayReduceDataUsage: true,
        analysisAutoExpandPriceHistory: false,
        displayAutoLoadSimilar: false,
      });
    },
    [update]
  );

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} onBack={() => router.back()} />
        <View style={styles.loadingWrap}>
          <Text style={[styles.loadingText, { color: textSecondary }]}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (page === 'brands') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} saved={savedPulse} onBack={() => router.back()} />
        <MultiSelectList
          placeholder="Search brands"
          options={BRAND_OPTIONS}
          selected={prefs.favoriteBrands}
          onChange={(next) => persist({ ...prefs, favoriteBrands: next }, { pulseSaved: true })}
        />
      </SafeAreaView>
    );
  }

  if (page === 'stores') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} saved={savedPulse} onBack={() => router.back()} />
        <MultiSelectList
          placeholder="Search stores"
          options={STORE_OPTIONS}
          selected={prefs.preferredStores}
          onChange={(next) => persist({ ...prefs, preferredStores: next }, { pulseSaved: true })}
        />
      </SafeAreaView>
    );
  }

  if (page === 'styles') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} saved={savedPulse} onBack={() => router.back()} />
        <StyleSelect
          selected={prefs.styleTags}
          onChange={(next) => persist({ ...prefs, styleTags: next }, { pulseSaved: true })}
        />
      </SafeAreaView>
    );
  }

  if (page === 'dealView') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} onBack={() => router.back()} />
        <RadioList
          value={prefs.analysisDefaultDealView}
          onChange={(next) => update({ analysisDefaultDealView: next as DealView })}
          options={[
            { id: 'bestOverall', title: 'Best Overall', subtitle: 'Recommended' },
            { id: 'lowestPrice', title: 'Lowest Price' },
            { id: 'bestValue', title: 'Best Value' },
            { id: 'mostTrusted', title: 'Most Trusted Store' },
            { id: 'mostPopular', title: 'Most Popular' },
          ]}
        />
      </SafeAreaView>
    );
  }

  if (page === 'analysisLayout') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} onBack={() => router.back()} />
        <RadioList
          value={prefs.analysisLayout}
          onChange={(next) => update({ analysisLayout: next as AnalysisLayout })}
          options={[
            { id: 'full', title: 'Full Detail', subtitle: 'More visible by default' },
            { id: 'compact', title: 'Compact', subtitle: 'Essentials first' },
          ]}
        />
      </SafeAreaView>
    );
  }

  if (page === 'comparePriority') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <Header title={title} onBack={() => router.back()} />
        <RadioList
          value={prefs.comparePriority}
          onChange={(next) => update({ comparePriority: next as ComparePriority })}
          options={[
            { id: 'bestValue', title: 'Best Value' },
            { id: 'lowestPrice', title: 'Lowest Price' },
            { id: 'bestQuality', title: 'Best Quality' },
            { id: 'mostFeatures', title: 'Most Features' },
            { id: 'mostTrustedBrand', title: 'Most Trusted Brand' },
          ]}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <Header title={title} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SectionLabel title="For You" />
        <Group>
          <Row
            title="Favorite Brands"
            subtitle="Influences recommendations and similarity."
            value={formatSelectionSummary(prefs.favoriteBrands)}
            onPress={() => pushPage('brands')}
          />
          <Separator />
          <Row
            title="Preferred Stores"
            subtitle="Prioritizes stores you trust when available."
            value={formatSelectionSummary(prefs.preferredStores)}
            onPress={() => pushPage('stores')}
          />
          <Separator />
          <Row
            title="Style Preferences"
            subtitle="Help DeaLo understand your taste."
            value={formatSelectionSummary(prefs.styleTags)}
            onPress={() => pushPage('styles')}
          />
          <Separator />
          <View style={styles.decisionRow}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowTitle, { color: textPrimary }]}>Decision Style</Text>
              <Text style={[styles.rowSubtitle, { color: textSecondary }]}>Choose what DeaLo should prioritize.</Text>
            </View>
            <View style={styles.decisionRight}>
              <Text style={[styles.rowValue, { color: textSecondary }]} numberOfLines={1}>
                {decisionStyleValue}
              </Text>
            </View>
          </View>
          <View style={styles.decisionControlWrap}>
            <Segmented3
              value={prefs.decisionStyle}
              onChange={(next) => update({ decisionStyle: next as DecisionStyle })}
              left={{ id: 'quality', label: 'Quality' }}
              center={{ id: 'balanced', label: 'Balanced' }}
              right={{ id: 'price', label: 'Lowest Price' }}
            />
          </View>
        </Group>

        <View style={styles.sectionGap} />

        <SectionLabel title="Analysis" />
        <Group>
          <Row
            title="Default Deal View"
            subtitle="Controls what’s shown first when analysis opens."
            value={dealViewLabel}
            onPress={() => pushPage('dealView')}
          />
          <Separator />
          <ToggleRow
            title="Auto-expand Price History"
            subtitle="Show the graph without tapping."
            value={prefs.analysisAutoExpandPriceHistory}
            onValueChange={(next) => update({ analysisAutoExpandPriceHistory: next })}
            disabled={reduceDataUsage}
          />
          <Separator />
          <ToggleRow
            title="Auto-expand Other Stores"
            subtitle="Show store list by default."
            value={prefs.analysisAutoExpandOtherStores}
            onValueChange={(next) => update({ analysisAutoExpandOtherStores: next })}
          />
          <Separator />
          <Row
            title="Analysis Layout"
            subtitle="Choose how much detail appears by default."
            value={analysisLayoutLabel}
            onPress={() => pushPage('analysisLayout')}
          />
          <Separator />
          <ToggleRow
            title="Keep AI explanation short"
            subtitle="Show a summary first; expand for full."
            value={prefs.analysisShortExplanation}
            onValueChange={(next) => update({ analysisShortExplanation: next })}
          />
        </Group>

        <View style={styles.sectionGap} />

        <SectionLabel title="Compare" />
        <Group>
          <Row
            title="Compare Priority"
            subtitle="Choose what DeaLo should emphasize when picking a winner."
            value={comparePriorityLabel}
            onPress={() => pushPage('comparePriority')}
          />
          <Separator />
          <ToggleRow
            title="Auto-expand Tradeoffs"
            subtitle="Show detailed category differences immediately."
            value={prefs.compareAutoExpandTradeoffs}
            onValueChange={(next) => update({ compareAutoExpandTradeoffs: next })}
          />
          <Separator />
          <ToggleRow
            title="Emphasize the winner"
            subtitle="Make the best pick visually obvious."
            value={prefs.compareEmphasizeWinner}
            onValueChange={(next) => update({ compareEmphasizeWinner: next })}
          />
        </Group>

        <View style={styles.sectionGap} />

        <SectionLabel title="Display & Data" />
        <Group>
          <ToggleRow
            title="Skip product sheet"
            subtitle="Open analysis immediately when tapping a product."
            value={prefs.displaySkipProductSheet}
            onValueChange={(next) => update({ displaySkipProductSheet: next })}
          />
          <Separator />
          <ToggleRow
            title="Auto-load Similar Items"
            subtitle="Show similar items without waiting."
            value={prefs.displayAutoLoadSimilar}
            onValueChange={(next) => update({ displayAutoLoadSimilar: next })}
            disabled={reduceDataUsage}
          />
          <Separator />
          <ToggleRow
            title="Reduce Data Usage"
            subtitle="Less preloading, faster on slow networks."
            value={prefs.displayReduceDataUsage}
            onValueChange={setReduceDataUsage}
          />
        </Group>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MultiSelectList({
  placeholder,
  options,
  selected,
  onChange,
}: {
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const bg = useThemeColor({}, 'bgPrimary');
  const surface1 = useThemeColor({}, 'surface1');
  const surface2 = useThemeColor({}, 'surface2');
  const border = useThemeColor({}, 'border');
  const divider = useThemeColor({}, 'divider');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const iconDefault = useThemeColor({}, 'icon');
  const brandPrimary = useThemeColor({}, 'brandPrimary');

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = useCallback(
    (item: string) => {
      const next = selectedSet.has(item) ? selected.filter((x) => x !== item) : [...selected, item];
      onChange(next);
    },
    [onChange, selected, selectedSet]
  );

  return (
    <View style={[styles.subpageWrap, { backgroundColor: bg }]}>
      <View style={[styles.searchWrap, { backgroundColor: surface1, borderColor: border }]}>
        <Ionicons name="search" size={16} color={iconDefault} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={textSecondary}
          style={[styles.searchInput, { color: textPrimary }]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {selected.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedChipsRow}>
          {selected.map((s) => (
            <TouchableOpacity
              key={s}
              activeOpacity={0.85}
              onPress={() => toggle(s)}
              style={[styles.selectedChip, { backgroundColor: surface2, borderColor: border }]}
            >
              <Text style={[styles.selectedChipText, { color: textPrimary }]} numberOfLines={1}>
                {s}
              </Text>
              <Ionicons name="close" size={14} color={iconDefault} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      <View style={[styles.listGroup, { backgroundColor: surface1, borderColor: border }]}>
        {filtered.map((opt, idx) => {
          const isOn = selectedSet.has(opt);
          return (
            <View key={opt}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => toggle(opt)} style={styles.listRow}>
                <Text style={[styles.listRowText, { color: textPrimary }]}>{opt}</Text>
                {isOn ? <Ionicons name="checkmark" size={18} color={brandPrimary} /> : <View style={{ width: 18 }} />}
              </TouchableOpacity>
              {idx === filtered.length - 1 ? null : <View style={[styles.sep, { backgroundColor: divider }]} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function StyleSelect({ selected, onChange }: { selected: string[]; onChange: (next: string[]) => void }) {
  const bg = useThemeColor({}, 'bgPrimary');
  const surface1 = useThemeColor({}, 'surface1');
  const border = useThemeColor({}, 'border');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const brandPrimary = useThemeColor({}, 'brandPrimary');

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = useCallback(
    (tag: string) => {
      const next = selectedSet.has(tag) ? selected.filter((t) => t !== tag) : [...selected, tag];
      onChange(next);
      if (Platform.OS === 'android') {
        try {
          const ToastAndroid = require('react-native').ToastAndroid;
          ToastAndroid.show('Saved', ToastAndroid.SHORT);
        } catch {}
      }
    },
    [onChange, selected, selectedSet]
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.stylesWrap, { backgroundColor: bg }]}>
      <Text style={[styles.stylesHint, { color: textSecondary }]}>Pick a few. You can change anytime.</Text>

      <View style={styles.tagsGrid}>
        {STYLE_TAGS.map((tag) => {
          const isOn = selectedSet.has(tag);
          return (
            <TouchableOpacity
              key={tag}
              activeOpacity={0.85}
              onPress={() => toggle(tag)}
              style={[
                styles.tagChip,
                { backgroundColor: surface1, borderColor: isOn ? brandPrimary : border },
                isOn ? { backgroundColor: brandPrimary } : null,
              ]}
            >
              <Text style={[styles.tagText, { color: isOn ? '#0F1412' : textPrimary }]}>{tag}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

function RadioList({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (next: string) => void;
  options: Array<{ id: string; title: string; subtitle?: string }>;
}) {
  const bg = useThemeColor({}, 'bgPrimary');
  const surface1 = useThemeColor({}, 'surface1');
  const border = useThemeColor({}, 'border');
  const divider = useThemeColor({}, 'divider');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const brandPrimary = useThemeColor({}, 'brandPrimary');

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.radioWrap, { backgroundColor: bg }]}>
      <View style={[styles.listGroup, { backgroundColor: surface1, borderColor: border }]}>
        {options.map((opt, idx) => {
          const selected = value === opt.id;
          return (
            <View key={opt.id}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => onChange(opt.id)} style={styles.radioRow}>
                <View style={styles.radioLeft}>
                  <Text style={[styles.radioTitle, { color: textPrimary }]}>{opt.title}</Text>
                  {opt.subtitle ? <Text style={[styles.radioSubtitle, { color: textSecondary }]}>{opt.subtitle}</Text> : null}
                </View>
                <Ionicons
                  name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={selected ? brandPrimary : textSecondary}
                />
              </TouchableOpacity>
              {idx === options.length - 1 ? null : <View style={[styles.sep, { backgroundColor: divider }]} />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  savedPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  savedText: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },

  loadingWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Manrope-Regular',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
    marginBottom: 10,
    fontFamily: 'Manrope-Regular',
  },
  group: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    minHeight: 60,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDisabled: {
    opacity: 0.55,
  },
  rowLeft: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
    fontFamily: 'Manrope-Regular',
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    fontFamily: 'Manrope-Regular',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 160,
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Manrope-Regular',
  },
  sep: {
    height: 1,
    width: '100%',
  },
  sectionGap: {
    height: 18,
  },
  bottomPad: {
    height: 12,
  },

  decisionRow: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  decisionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 2,
    maxWidth: 140,
  },
  decisionControlWrap: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },

  segWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  segLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  segRight: {
    borderRightWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  segText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Manrope-Regular',
  },

  subpageWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  searchWrap: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Manrope-Regular',
  },
  selectedChipsRow: {
    paddingBottom: 10,
    gap: 10,
  },
  selectedChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '800',
    maxWidth: 160,
    fontFamily: 'Manrope-Regular',
  },
  listGroup: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listRow: {
    height: 58,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listRowText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Manrope-Regular',
  },

  stylesWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  stylesHint: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Manrope-Regular',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Manrope-Regular',
  },

  radioWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  radioRow: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioLeft: {
    flex: 1,
    paddingRight: 12,
  },
  radioTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 2,
    fontFamily: 'Manrope-Regular',
  },
  radioSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    fontFamily: 'Manrope-Regular',
  },
});
