import { Platform } from 'react-native';

/**
 * AdMob configuration for DeaLo.
 *
 * IMPORTANT: Replace these test IDs with real AdMob unit IDs before publishing.
 * Test IDs are provided by Google for development and will show test banners.
 *
 * To get real IDs:
 * 1. Create an AdMob account at https://admob.google.com
 * 2. Add your app (iOS + Android)
 * 3. Create ad units (Banner, Interstitial)
 * 4. Replace the IDs below
 */

// Google-provided test ad unit IDs (safe for development)
const TEST_BANNER_ANDROID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_BANNER_IOS = 'ca-app-pub-3940256099942544/2934735716';
const TEST_INTERSTITIAL_ANDROID = 'ca-app-pub-3940256099942544/1033173712';
const TEST_INTERSTITIAL_IOS = 'ca-app-pub-3940256099942544/4411468910';

// TODO: Replace with real AdMob IDs before publishing
const PROD_BANNER_ANDROID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_BANNER_IOS = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_INTERSTITIAL_ANDROID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_INTERSTITIAL_IOS = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

const IS_DEV = __DEV__;

export const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: IS_DEV ? TEST_BANNER_IOS : PROD_BANNER_IOS,
    android: IS_DEV ? TEST_BANNER_ANDROID : PROD_BANNER_ANDROID,
    default: TEST_BANNER_ANDROID,
  }),
  interstitial: Platform.select({
    ios: IS_DEV ? TEST_INTERSTITIAL_IOS : PROD_INTERSTITIAL_IOS,
    android: IS_DEV ? TEST_INTERSTITIAL_ANDROID : PROD_INTERSTITIAL_ANDROID,
    default: TEST_INTERSTITIAL_ANDROID,
  }),
};

// AdMob App IDs (set in app.json plugins)
export const ADMOB_APP_ID = Platform.select({
  // TODO: Replace with real AdMob App IDs
  ios: 'ca-app-pub-3940256099942544~1458002511',
  android: 'ca-app-pub-3940256099942544~3347511713',
  default: 'ca-app-pub-3940256099942544~3347511713',
});

/**
 * Track how many scans since last interstitial ad.
 * Show an interstitial every N scans to avoid being too intrusive.
 */
let scansSinceLastAd = 0;
const SCANS_BETWEEN_ADS = 3;

export function shouldShowInterstitial(): boolean {
  scansSinceLastAd++;
  if (scansSinceLastAd >= SCANS_BETWEEN_ADS) {
    scansSinceLastAd = 0;
    return true;
  }
  return false;
}

export function resetAdCounter(): void {
  scansSinceLastAd = 0;
}
