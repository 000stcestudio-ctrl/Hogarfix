/**
 * Design system tokens for Hogarfix ("Liquid Glass / Soft UI" accessible)
 */

export const Palette = {
  primary: '#0D5BFF',
  primaryDark: '#2E75FF',
  primaryLight: '#EBF1FF',
  accent: '#FF7A00',
  accentLight: '#FFF4EB',
  online: '#10B981',
  onlineLight: '#ECFDF5',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',

  // Light Mode Surfaces
  lightBg: '#F6F8FA',
  lightCard: '#FFFFFF',
  lightBorder: '#E5E7EB',
  lightText: '#111827',
  lightTextSecondary: '#4B5563',
  lightTextMuted: '#9CA3AF',

  // Dark Mode Surfaces
  darkBg: '#121418',
  darkCard: '#1E2229',
  darkCardSecondary: '#262B34',
  darkBorder: '#2D333F',
  darkText: '#F9FAFB',
  darkTextSecondary: '#D1D5DB',
  darkTextMuted: '#9CA3AF',
};

export type ThemeColor =
  | 'primary'
  | 'background'
  | 'backgroundElement'
  | 'backgroundSelected'
  | 'card'
  | 'cardSecondary'
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'border'
  | 'accent'
  | 'online';

export const Colors = {
  light: {
    primary: Palette.primary,
    primaryLight: Palette.primaryLight,
    accent: Palette.accent,
    online: Palette.online,
    onlineLight: Palette.onlineLight,
    background: Palette.lightBg,
    backgroundElement: '#E5E7EB',
    backgroundSelected: '#E0E7FF',
    card: Palette.lightCard,
    cardSecondary: '#F1F4F8',
    border: Palette.lightBorder,
    text: Palette.lightText,
    textSecondary: Palette.lightTextSecondary,
    textMuted: Palette.lightTextMuted,
    tint: Palette.primary,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: Palette.primary,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
  },
  dark: {
    primary: Palette.primaryDark,
    primaryLight: 'rgba(46, 117, 255, 0.15)',
    accent: Palette.accent,
    online: Palette.online,
    onlineLight: 'rgba(16, 185, 129, 0.15)',
    background: Palette.darkBg,
    backgroundElement: '#2D333F',
    backgroundSelected: '#374151',
    card: Palette.darkCard,
    cardSecondary: Palette.darkCardSecondary,
    border: Palette.darkBorder,
    text: Palette.darkText,
    textSecondary: Palette.darkTextSecondary,
    textMuted: Palette.darkTextMuted,
    tint: Palette.primaryDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: Palette.primaryDark,
    shadowColor: 'rgba(0, 0, 0, 0.35)',
  },
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 40,
  six: 48,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 26,
  full: 9999,
};

export const Shadows = {
  soft: {
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.06)',
  },
  card: {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
  floating: {
    boxShadow: '0 8px 24px rgba(13, 91, 255, 0.18)',
  },
};

export const Accessibility = {
  minTouchTarget: 50,
};

export const Fonts = {
  rounded: 'System',
  mono: 'SpaceMono',
};

export const MaxContentWidth = 800;
