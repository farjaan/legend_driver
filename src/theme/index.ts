import type { ColorSchemeName } from 'react-native';
import { BrandColors, Colors } from '@constants/colors';

export type ThemeName = 'light' | 'dark';
export type ThemePreference = ThemeName | 'system';

export type ThemeTokens = {
  name: ThemeName;
  /** Main app canvas (lists, tabs) */
  screenBackground: string;
  background: string;
  surface: string;
  elevatedSurface: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  border: string;
  cardBorder: string;
  overlay: string;
  primary: string;
  primarySoft: string;
  accentOrange: string;
  danger: string;
  success: string;
};

export const addAlpha = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = Math.floor(bigint / 65536) % 256;
  const g = Math.floor((bigint % 65536) / 256);
  const b = bigint % 256;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Same token map as legend-car-rental/src/theme/index.ts */
export const ThemeTokensMap: Record<ThemeName, ThemeTokens> = {
  light: {
    name: 'light',
    screenBackground: '#F4F2F7',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    elevatedSurface: '#FFFFFF',
    text: Colors.text,
    textMuted: Colors.textSecondary,
    textSecondary: Colors.textSecondary,
    border: '#E5E7EB',
    cardBorder: 'rgba(44, 27, 71, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    primary: BrandColors.brandPrimary,
    primarySoft: addAlpha(BrandColors.brandPrimary, 0.12),
    accentOrange: BrandColors.accentOrange,
    danger: Colors.danger,
    success: Colors.success,
  },
  dark: {
    name: 'dark',
    screenBackground: '#0E0E11',
    background: '#0E0E11',
    surface: '#181820',
    elevatedSurface: '#1F1F26',
    text: '#F3F4F6',
    textMuted: '#9CA3AF',
    textSecondary: '#9CA3AF',
    border: '#2A2A35',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: Colors.white,
    primarySoft: addAlpha(Colors.white, 0.18),
    accentOrange: BrandColors.accentOrange,
    danger: Colors.danger,
    success: Colors.success,
  },
};

export const resolveThemeName = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ThemeName => {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
};

export const getThemeFromPreference = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ThemeTokens => ThemeTokensMap[resolveThemeName(preference, systemScheme)];
