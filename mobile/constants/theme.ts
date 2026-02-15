/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const BRAND_GREEN = '#0E9F6E';

const tintColorLight = BRAND_GREEN;
const tintColorDark = '#5FBF9A';

export const Colors = {
  light: {
    text: '#111827',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: 'rgba(17,24,39,0.7)',
    tabIconDefault: 'rgba(17,24,39,0.55)',
    tabIconSelected: tintColorLight,

    bgPrimary: '#FFFFFF',
    surface1: '#FFFFFF',
    surface2: '#F3F4F6',
    surface3: '#E5E7EB',

    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    brandPrimary: BRAND_GREEN,
    brandPressed: '#0B7F58',
    brandSubtle: '#CDEFE2',

    divider: 'rgba(17,24,39,0.08)',
    border: 'rgba(17,24,39,0.12)',
  },
  dark: {
    text: '#E6ECE9',
    background: '#0F1412',
    tint: tintColorDark,
    icon: 'rgba(230,236,233,0.7)',
    tabIconDefault: 'rgba(230,236,233,0.55)',
    tabIconSelected: tintColorDark,

    bgPrimary: '#0F1412',
    surface1: '#151B18',
    surface2: '#1B2320',
    surface3: '#212B26',

    textPrimary: '#E6ECE9',
    textSecondary: '#A7B2AC',
    textMuted: '#7F8A84',

    brandPrimary: '#5FBF9A',
    brandPressed: '#4AAE8A',
    brandSubtle: '#3A6F5A',

    divider: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.08)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
