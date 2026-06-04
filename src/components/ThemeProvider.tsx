import React, { type ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme } from '@config/theme';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const { themeName, isDarkMode } = useAppTheme();
  const paperTheme = themeName === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {children}
    </PaperProvider>
  );
}
