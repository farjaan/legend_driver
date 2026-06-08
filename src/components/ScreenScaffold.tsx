import React, { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { ScreenHeader } from '@components/ScreenHeader';
import { BrandColors } from '@constants/colors';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  bottomInset?: number;
  onBack?: () => void;
  loading?: boolean;
  compact?: boolean;
  fill?: boolean;
};

export function ScreenScaffold({
  title,
  subtitle,
  children,
  scroll = true,
  bottomInset = 0,
  onBack,
  loading,
  compact,
  fill,
}: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.screenBackground }]}>
      <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} compact={compact} />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={BrandColors.accentOrange} />
        </View>
      ) : (
        <ScreenContainer
          scroll={scroll}
          bottomInset={bottomInset}
          includeTopInset={false}
          fill={fill}>
          {children}
        </ScreenContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
