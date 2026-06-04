import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useThemeStore } from '@store/themeStore';
import {
  getThemeFromPreference,
  resolveThemeName,
  type ThemePreference,
  type ThemeTokens,
} from './index';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themePreference = useThemeStore(s => s.themePreference);
  const setThemePreference = useThemeStore(s => s.setThemePreference);

  const themeName = useMemo(
    () => resolveThemeName(themePreference, systemScheme),
    [themePreference, systemScheme],
  );

  const theme = useMemo<ThemeTokens>(
    () => getThemeFromPreference(themePreference, systemScheme),
    [themePreference, systemScheme],
  );

  return {
    theme,
    themeName,
    themePreference,
    setThemePreference,
    isDarkMode: themeName === 'dark',
  };
}

export type { ThemePreference, ThemeTokens };
