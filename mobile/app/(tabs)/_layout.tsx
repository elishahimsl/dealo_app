import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated, PanResponder, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StackActions, TabActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LeftTabKey = 'home' | 'compare' | 'discover';
type RightTabKey = 'account' | 'camera';
type TabKey = LeftTabKey | 'deals' | RightTabKey;

const BRAND_GREEN = '#0E9F6E';
const INACTIVE = '#374151';
const ACTIVE_ICON = '#111827';
const ACTIVE_BG = '#FFFFFF';
const PILL_BG = '#E5E7EB';
const ICON_SIZE = 22;
const LEFT_ICON_SIZE = 26;
const LEFT_PILL_H = 56;
const LEFT_PILL_W = 186;
const LEFT_PILL_PAD = 2;
const INDICATOR_PAD = 0;
const RIGHT_BTN = 56;

type AccountProfile = {
  name: string;
  email: string;
  phone: string;
  bio: string;
};

const DEFAULT_ACCOUNT_PROFILE: AccountProfile = {
  name: '',
  email: '',
  phone: '',
  bio: '',
};

type AccountProfileContextValue = {
  profile: AccountProfile;
  setProfile: React.Dispatch<React.SetStateAction<AccountProfile>>;
};

const AccountProfileContext = React.createContext<AccountProfileContextValue | null>(null);

export function useAccountProfile() {
  const ctx = React.useContext(AccountProfileContext);
  if (!ctx) throw new Error('useAccountProfile must be used within AccountProfileContext');
  return ctx;
}

function CompareIcon({ size, focused }: { size: number; focused: boolean }) {
  const color = focused ? ACTIVE_ICON : INACTIVE;
  const semiW = Math.round(size * 0.38);
  const semiH = Math.round(size * 0.76);
  const gap = Math.round(size * 0.06);

  return (
    <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {/* Left semi-circle - curved side facing LEFT (outward) */}
      <View
        style={{
          width: semiW,
          height: semiH,
          backgroundColor: color,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: semiW,
          borderBottomRightRadius: semiW,
        }}
      />
      {/* Gap between */}
      <View style={{ width: gap }} />
      {/* Right semi-circle - curved side facing RIGHT (outward) */}
      <View
        style={{
          width: semiW,
          height: semiH,
          backgroundColor: color,
          borderTopLeftRadius: semiW,
          borderBottomLeftRadius: semiW,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
    </View>
  );
}

function DiscoverIcon({ size, focused }: { size: number; focused: boolean }) {
  const bg = focused ? '#000000' : INACTIVE;
  const outerR = Math.round(size * 0.46);
  const innerR = Math.round(size * 0.32);
  const needleBase = Math.max(10, Math.round(size * 0.32));
  const needleTopH = Math.max(10, Math.round(size * 0.34));
  const needleBottomH = Math.max(8, Math.round(size * 0.22));

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Outer circle */}
      <View
        style={{
          width: outerR * 2,
          height: outerR * 2,
          borderRadius: outerR,
          backgroundColor: bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Compass needle */}
        <View
          style={{
            position: 'absolute',
            transform: [{ rotate: '45deg' }],
          }}
        >
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: needleBase / 2,
              borderRightWidth: needleBase / 2,
              borderBottomWidth: needleTopH,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#FFFFFF',
            }}
          />
          <View
            style={{
              marginTop: -1,
              width: 0,
              height: 0,
              borderLeftWidth: needleBase / 2,
              borderRightWidth: needleBase / 2,
              borderTopWidth: needleBottomH,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: 'rgba(255,255,255,0.9)',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            width: Math.max(3, Math.round(size * 0.1)),
            height: Math.max(3, Math.round(size * 0.1)),
            borderRadius: 999,
            backgroundColor: '#FFFFFF',
          }}
        />
      </View>
    </View>
  );
}

function HomeIcon({ size, focused }: { size: number; focused: boolean }) {
  const fill = focused ? ACTIVE_ICON : INACTIVE;
  const door = focused ? '#FFFFFF' : PILL_BG;

  const roofSize = Math.round(size * 0.66);
  const bodyW = Math.round(size * 0.74);
  const bodyH = Math.round(size * 0.5);
  const bodyR = Math.round(size * 0.14);
  const doorW = Math.round(size * 0.18);
  const doorH = Math.round(size * 0.22);

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          position: 'absolute',
          top: Math.round(size * 0.08),
          width: roofSize,
          height: roofSize,
          backgroundColor: fill,
          transform: [{ rotate: '45deg' }],
          borderRadius: Math.round(size * 0.08),
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: Math.round(size * 0.08),
          width: bodyW,
          height: bodyH,
          backgroundColor: fill,
          borderRadius: bodyR,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: Math.round(size * 0.12),
          width: doorW,
          height: doorH,
          borderRadius: Math.round(size * 0.08),
          backgroundColor: door,
        }}
      />
    </View>
  );
}

const LEFT_TABS: { key: LeftTabKey }[] = [
  { key: 'home' },
  { key: 'discover' },
  { key: 'compare' },
];

const CAMERA_TAB: RightTabKey = 'camera';

function CustomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments() as unknown as string[];

  const goToTabRoot = (key: TabKey) => {
    const tabRoute = props.state.routes.find((r) => r.name === key);

    if (!tabRoute) {
      if (key === 'deals') {
        router.replace('/(tabs)/deals' as any);
      }
      return;
    }

    try {
      props.navigation.dispatch(TabActions.jumpTo(key as any));
    } catch {
      if (key === 'deals') {
        router.replace('/(tabs)/deals' as any);
        return;
      }
    }

    const nestedState = tabRoute?.state as any;
    const nestedKey: string | undefined = nestedState?.key;
    const nestedIndex: number = nestedState?.index ?? 0;

    if (nestedKey && nestedIndex > 0) {
      props.navigation.dispatch({ ...StackActions.popToTop(), target: nestedKey });
    }
  };

  const [leftWidth, setLeftWidth] = useState(0);
  const segmentW = useMemo(() => {
    if (!leftWidth) return 0;
    const inner = Math.max(0, leftWidth - LEFT_PILL_PAD * 2);
    return inner / LEFT_TABS.length;
  }, [leftWidth]);

  const currentRouteName = props.state.routes[props.state.index]?.name;
  const currentLeftIndex = useMemo(() => 
    LEFT_TABS.findIndex((t) => t.key === currentRouteName), 
    [currentRouteName]
  );

  const [lastLeftIndex, setLastLeftIndex] = useState(0);

  useEffect(() => {
    if (currentLeftIndex >= 0) setLastLeftIndex(currentLeftIndex);
  }, [currentLeftIndex]);

  const activeLeftIndex = currentLeftIndex >= 0 ? currentLeftIndex : lastLeftIndex;

  const indicatorX = useRef(new Animated.Value(0)).current;
  const dragStartX = useRef(0);

  useEffect(() => {
    if (!segmentW) return;
    Animated.timing(indicatorX, {
      toValue: activeLeftIndex * segmentW,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [activeLeftIndex, indicatorX, segmentW]);

  const indicatorTranslateX = useMemo(() => {
    return Animated.add(indicatorX, new Animated.Value(LEFT_PILL_PAD + INDICATOR_PAD));
  }, [indicatorX]);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        if (!segmentW) return false;
        return Math.abs(gesture.dx) > 6 && Math.abs(gesture.dy) < 12;
      },
      onPanResponderGrant: () => {
        indicatorX.stopAnimation((v) => {
          dragStartX.current = v;
        });
      },
      onPanResponderMove: (_evt, gesture) => {
        if (!segmentW) return;
        const max = (LEFT_TABS.length - 1) * segmentW;
        const next = Math.max(0, Math.min(max, dragStartX.current + gesture.dx));
        indicatorX.setValue(next);
      },
      onPanResponderRelease: () => {
        if (!segmentW) return;
        indicatorX.stopAnimation((v) => {
          const idx = Math.max(0, Math.min(LEFT_TABS.length - 1, Math.round(v / segmentW)));
          Animated.spring(indicatorX, {
            toValue: idx * segmentW,
            useNativeDriver: true,
            damping: 18,
            stiffness: 220,
            mass: 0.9,
          }).start();
          goToTabRoot(LEFT_TABS[idx].key);
        });
      },
      onPanResponderTerminate: () => {},
    });
  }, [goToTabRoot, indicatorX, segmentW]);

  const dealsFocused = segments.includes('deals');
  const cameraFocused = segments.includes('camera') || currentRouteName === CAMERA_TAB;

  // Don't render the tab bar if we're on the camera screen
  if (cameraFocused) {
    return null;
  }

  return (
    <View style={[styles.root, { paddingBottom: Math.max(10, insets.bottom + 6) }]}>
      <View style={styles.row}>
        <View
          style={styles.leftPill}
          onLayout={(e) => setLeftWidth(e.nativeEvent.layout.width)}
          {...panResponder.panHandlers}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.leftIndicator,
              {
                width: Math.max(0, segmentW),
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />

          {LEFT_TABS.map((t, idx) => {
            const focused = (currentLeftIndex >= 0 ? currentLeftIndex : lastLeftIndex) === idx;
            return (
              <TouchableOpacity
                key={t.key}
                activeOpacity={0.85}
                style={styles.leftItem}
                onPress={() => goToTabRoot(t.key)}
              >
                <View style={styles.leftIconWrap}>
                  {t.key === 'home' ? (
                    <HomeIcon size={LEFT_ICON_SIZE} focused={focused} />
                  ) : t.key === 'discover' ? (
                    <DiscoverIcon size={LEFT_ICON_SIZE} focused={focused} />
                  ) : (
                    <CompareIcon size={LEFT_ICON_SIZE} focused={focused} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.rightGroup}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => goToTabRoot('deals')}
            style={[styles.profileBtn, dealsFocused && styles.profileBtnActive]}
          >
            <Ionicons name="pricetag" size={ICON_SIZE + 2} color={ACTIVE_ICON} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => props.navigation.navigate(CAMERA_TAB as never)}
            style={[styles.cameraBtn, cameraFocused && styles.cameraBtnActive]}
          >
            <Ionicons name="camera" size={ICON_SIZE + 2} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const [profile, setProfile] = useState<AccountProfile>(DEFAULT_ACCOUNT_PROFILE);
  const profileContextValue = useMemo(() => ({ profile, setProfile }), [profile]);

  return (
    <AccountProfileContext.Provider value={profileContextValue}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.hiddenTabBar,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="products/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
          }}
        />
        <Tabs.Screen
          name="deals/index"
          options={{
            title: 'Deals',
          }}
        />
        <Tabs.Screen
          name="compare"
          options={{
            title: 'Compare',
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Camera',
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
          }}
        />
        <Tabs.Screen
          name="filter/index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AccountProfileContext.Provider>
  );
}

const styles = StyleSheet.create({
  hiddenTabBar: {
    height: 0,
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    zIndex: 999,
    elevation: 999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftPill: {
    height: LEFT_PILL_H,
    width: LEFT_PILL_W,
    borderRadius: 999,
    backgroundColor: PILL_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LEFT_PILL_PAD,
    marginLeft: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  leftIndicator: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    borderRadius: 999,
    backgroundColor: ACTIVE_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  leftItem: {
    flex: 1,
    height: LEFT_PILL_H,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  leftIconWrap: {
    width: LEFT_ICON_SIZE + 14,
    height: LEFT_ICON_SIZE + 14,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -2 }],
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 10,
  },
  profileBtn: {
    width: RIGHT_BTN,
    height: RIGHT_BTN,
    borderRadius: RIGHT_BTN / 2,
    backgroundColor: PILL_BG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 9,
  },
  profileBtnActive: {
    backgroundColor: '#D1D5DB',
  },
  profileInitial: {
    color: INACTIVE,
    fontWeight: '900',
    fontSize: 16,
  },
  profileInitialActive: {
    color: ACTIVE_ICON,
  },
  cameraBtn: {
    width: RIGHT_BTN,
    height: RIGHT_BTN,
    borderRadius: RIGHT_BTN / 2,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 10,
  },
  cameraBtnActive: {
    shadowOpacity: 0.48,
  },
});