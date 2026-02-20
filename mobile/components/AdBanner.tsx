import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AD_UNIT_IDS } from '../lib/services/ad-service';

// Dynamically require native ads SDK — fails gracefully in Expo Go
let BannerAd: any = null;
let BannerAdSize: any = null;
try {
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
} catch {
  // Native module not available (Expo Go)
}

/**
 * AdBanner component — displays a Google AdMob adaptive banner ad.
 * Falls back to a subtle placeholder if native SDK unavailable or ad fails.
 */
export default function AdBanner({ style }: { style?: any }) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  const unitId = AD_UNIT_IDS.banner;
  if (!unitId) return null;

  // Fallback for Expo Go or ad load failure
  if (!BannerAd || adError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.fallbackBanner}>
          <Text style={styles.adLabel}>Ad</Text>
          <Text style={styles.adText}>Sponsored</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style, !adLoaded && styles.hidden]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => setAdLoaded(true)}
        onAdFailedToLoad={(error: any) => {
          console.warn('Ad failed to load:', error);
          setAdError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
  fallbackBanner: {
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
