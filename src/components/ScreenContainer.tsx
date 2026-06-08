import React, { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  bottomInset?: number;
  includeTopInset?: boolean;
  /** When true, content stretches to fill the screen (e.g. centered empty states). */
  fill?: boolean;
};

export function ScreenContainer({
  children,
  scroll = true,
  style,
  bottomInset = 0,
  includeTopInset = true,
  fill = false,
}: Props) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: includeTopInset ? insets.top + Spacing.sm : Spacing.xs,
    paddingBottom: Math.max(insets.bottom, Spacing.sm) + bottomInset,
    paddingHorizontal: Spacing.lg,
  };

  const rootStyle = { flex: 1, backgroundColor: theme.screenBackground };

  if (scroll) {
    return (
      <ScrollView
        style={[rootStyle, style]}
        contentContainerStyle={[fill ? styles.contentFill : styles.content, padding]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    );
  }

  return <View style={[rootStyle, padding, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 0,
  },
  contentFill: {
    flexGrow: 1,
  },
});
