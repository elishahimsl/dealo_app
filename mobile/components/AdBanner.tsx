import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const BRAND_GREEN = '#0E9F6E';

/**
 * AdBanner component — placeholder that will display a Google AdMob banner.
 *
 * Once `react-native-google-mobile-ads` is installed and configured,
 * replace the placeholder View with the real BannerAd component:
 *
 * ```tsx
 * import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
 * import { AD_UNIT_IDS } from '../lib/services/ad-service';
 *
 * <BannerAd
 *   unitId={AD_UNIT_IDS.banner}
 *   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
 *   requestOptions={{ requestNonPersonalizedAdsOnly: !personalizedAds }}
 * />
 * ```
 *
 * For now, this shows a styled placeholder so the UI layout is correct.
 */
export default function AdBanner({ style }: { style?: any }) {
  const [adLoaded, setAdLoaded] = useState(false);

  // Placeholder banner — swap for real BannerAd when AdMob SDK is installed
  return (
    <View style={[styles.container, style]}>
      <View style={styles.placeholderBanner}>
        <Text style={styles.adLabel}>Ad</Text>
        <Text style={styles.adText}>Sponsored</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  placeholderBanner: {
    width: '100%',
    height: 52,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontFamily: 'Manrope-Regular',
  },
  adText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Manrope-Regular',
  },
});
