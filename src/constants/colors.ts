/**
 * Aligned with legend-car-rental: src/constants/colors.ts
 */
export const BrandColors = {
  brandPrimary: '#2C1B47',
  brandDeep: '#2C1B47',
  brandBurgundy: '#5C1B3E',
  brandBurgundyDeep: '#3E1538',
  brandBurgundyMuted: '#8B2B5C',
  brandSecondary: '#5E366D',
  accentOrange: '#F08900',
  secondaryOrange: '#C67406',
  textCharcoal: '#2C2F36',
  brandWhite: '#FFFFFF',
} as const;

export const Colors = {
  ...BrandColors,
  black: '#0B0B0F',
  white: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  bg: '#FFFFFF',
} as const;

export type AppColors = typeof Colors;
