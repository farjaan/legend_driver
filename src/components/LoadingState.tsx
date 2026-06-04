import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BrandColors } from '@constants/colors';
import { useAppTheme } from '@theme/useAppTheme';

export function LoadingState() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.screenBackground }]}>
      <ActivityIndicator color={BrandColors.accentOrange} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
