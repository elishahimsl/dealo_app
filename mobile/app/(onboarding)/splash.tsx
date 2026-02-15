import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Mask, Path, Rect, Stop } from 'react-native-svg';

// ✅ IMPORTANT: update this import path to wherever your real "no-smile" logo component lives.
// Example if your logo component is in /assets/dealo-mark-white.tsx:
import DeaLoMarkWhiteNoSmile from '../../assets/images/logos/whiteLogo/dealo-mark-white-nosmile';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function SplashScreen() {
  const router = useRouter();

  // Fade in bg, fade/scale in logo, draw smile, fade out, navigate
  const bgOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.94);
  const exitOpacity = useSharedValue(1);

  // ✅ Only animate the smile
  const smileDraw = useSharedValue(0);

  // Sizing for the rendered mark on splash
  const LOGO_W = 168;
  const LOGO_H = 182;

  // ✅ MUST match your base logo viewBox (from your full logo SVG)
  const LOGO_VIEWBOX = '0 0 473 513';

  // ✅ Smile path in the original 600x650.22 mark coordinate system (with the closing "Z" removed)
  // We scale it into the 473x513 mark viewBox so it lines up exactly.
  const SMILE_D =
    'M321.08,428.65c5.79,9.03,3.16,21.03-5.87,26.82,0,0-62.33,48.49-110.07,31.11-52.65-19.16-64.33-94.61-64.33-94.61-3.45-10.15,1.98-21.18,12.13-24.63,10.15-3.45,21.18,1.98,24.63,12.13.01.05,14.42,38.9,47.96,51.11,34.31,12.49,69.58-8.3,69.58-8.3,8.97-5.12,20.39-2.32,25.97,6.38';

  const SMILE_D_FILL =
    'M321.08,428.65c5.79,9.03,3.16,21.03-5.87,26.82,0,0-62.33,48.49-110.07,31.11-52.65-19.16-64.33-94.61-64.33-94.61-3.45-10.15,1.98-21.18,12.13-24.63,10.15-3.45,21.18,1.98,24.63,12.13.01.05,14.42,38.9,47.96,51.11,34.31,12.49,69.58-8.3,69.58-8.3,8.97-5.12,20.39-2.32,25.97,6.38Z';

  const SMILE_SCALE_X = 473 / 600;
  const SMILE_SCALE_Y = 513 / 650.22;

  // Dash length: big enough to cover the path length
  const DASH = 2600;
  const MASK_W = 520;

  // Background fade
  const bgAnimatedProps = useAnimatedProps(() => {
    return { opacity: bgOpacity.value } as any;
  });

  // Logo fade/scale + exit fade
  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value * exitOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  // Smile stroke draw
  const smileStrokeAnimatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: DASH * (1 - smileDraw.value),
      opacity: exitOpacity.value,
    } as any;
  });

  const smileFillAnimatedProps = useAnimatedProps(() => {
    return {
      opacity: exitOpacity.value,
    } as any;
  });

  const smileClipAnimatedProps = useAnimatedProps(() => {
    return {
      x: -MASK_W + MASK_W * smileDraw.value,
    } as any;
  });

  useEffect(() => {
    // 0.00–0.20 background in
    bgOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });

    // 0.20–0.45 logo in
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) }));
    logoScale.value = withDelay(200, withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) }));

    // ~0.70–0.92 draw smile only
    smileDraw.value = withDelay(700, withTiming(1, { duration: 360, easing: Easing.inOut(Easing.cubic) }));

    // 1.15–1.25 exit
    exitOpacity.value = withDelay(1150, withTiming(0, { duration: 100, easing: Easing.out(Easing.cubic) }));

    const t = setTimeout(() => {
      router.replace('/(onboarding)/get-started' as Href);
    }, 1250);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Background */}
      <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="splashBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#89C745" />
            <Stop offset="1" stopColor="#53982B" />
          </LinearGradient>
        </Defs>
        <AnimatedRect
          animatedProps={bgAnimatedProps}
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#splashBg)"
        />
      </Svg>

      {/* Centered logo */}
      <View style={styles.centerGroup}>
        <Animated.View style={[styles.logoShadow, logoStyle]}>
          {/* ✅ Base logo WITHOUT smile */}
          {/* If your component uses `fill` not `color`, change prop name accordingly */}
          <DeaLoMarkWhiteNoSmile width={LOGO_W} height={LOGO_H} color="#FFFFFF" />

          {/* ✅ Smile overlay (stroke-drawn) */}
          <Svg
            pointerEvents="none"
            width={LOGO_W}
            height={LOGO_H}
            viewBox={LOGO_VIEWBOX}
            style={StyleSheet.absoluteFillObject}
          >
            <Defs>
              <LinearGradient id="smileMaskGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="0.86" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="1" stopColor="#000000" stopOpacity={0} />
              </LinearGradient>

              <Mask id="smileMask" maskUnits="userSpaceOnUse" x="0" y="0" width="473" height="513">
                <AnimatedRect
                  animatedProps={smileClipAnimatedProps}
                  x={-MASK_W}
                  y="0"
                  height="513"
                  width={MASK_W}
                  fill="url(#smileMaskGrad)"
                />
              </Mask>
            </Defs>

            <AnimatedPath
              animatedProps={smileFillAnimatedProps}
              d={SMILE_D_FILL}
              transform={`scale(${SMILE_SCALE_X} ${SMILE_SCALE_Y})`}
              fill="#FFFFFF"
              stroke="none"
              mask="url(#smileMask)"
            />
            <AnimatedPath
              animatedProps={smileStrokeAnimatedProps}
              d={SMILE_D}
              transform={`scale(${SMILE_SCALE_X} ${SMILE_SCALE_Y})`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={23} // tuned for scaled smile path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH}
            />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
});
