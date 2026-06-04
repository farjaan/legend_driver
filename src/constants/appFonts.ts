/**
 * Aligned with legend-car-rental: src/constants/appFonts.ts
 * Fonts: src/assets/fonts/InriaSerif-*.ttf (copied from user app shared assets)
 */
export const APP_FONTS = {
  regular: 'InriaSerif-Regular',
  light: 'InriaSerif-Light',
  bold: 'InriaSerif-Bold',
  italic: 'InriaSerif-Italic',
  lightItalic: 'InriaSerif-LightItalic',
  boldItalic: 'InriaSerif-BoldItalic',
} as const;

export type AppFontKey = keyof typeof APP_FONTS;

export const DISPLAY_SERIF_FONT = APP_FONTS.bold;
export const UI_FONT = APP_FONTS.regular;
