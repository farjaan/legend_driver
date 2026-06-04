import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { BrandColors } from '@constants/colors';
import type { ThemeTokens } from './index';

export function getNavigationTheme(theme: ThemeTokens): NavTheme {
  const base = theme.name === 'dark' ? NavDark : NavLight;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: BrandColors.accentOrange,
      background: theme.screenBackground,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: BrandColors.accentOrange,
    },
  };
}
