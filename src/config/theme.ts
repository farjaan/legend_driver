import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';

/** Re-export for screens that import from @config/theme */
export { BrandColors, Colors };

const paperFontConfig = {
  fontFamily: APP_FONTS.regular,
};

const fonts = configureFonts({
  config: {
    displayLarge: paperFontConfig,
    displayMedium: paperFontConfig,
    displaySmall: { fontFamily: APP_FONTS.bold },
    headlineLarge: { fontFamily: APP_FONTS.bold },
    headlineMedium: { fontFamily: APP_FONTS.bold },
    headlineSmall: { fontFamily: APP_FONTS.bold },
    titleLarge: { fontFamily: APP_FONTS.bold },
    titleMedium: { fontFamily: APP_FONTS.bold },
    titleSmall: { fontFamily: APP_FONTS.bold },
    bodyLarge: paperFontConfig,
    bodyMedium: paperFontConfig,
    bodySmall: paperFontConfig,
    labelLarge: { fontFamily: APP_FONTS.bold },
    labelMedium: paperFontConfig,
    labelSmall: paperFontConfig,
  },
});

export const lightTheme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: BrandColors.brandPrimary,
    onPrimary: BrandColors.brandWhite,
    secondary: BrandColors.brandSecondary,
    background: Colors.bg,
    surface: Colors.white,
    surfaceVariant: '#F3F4F6',
    error: Colors.danger,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.white,
    onPrimary: BrandColors.brandPrimary,
    secondary: BrandColors.brandSecondary,
    background: '#0E0E11',
    surface: '#181820',
    error: Colors.danger,
  },
};

export type AppTheme = typeof lightTheme;
