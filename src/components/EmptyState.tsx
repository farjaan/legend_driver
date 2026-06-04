import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;
};

export function EmptyState({ title, subtitle, icon = 'inbox' }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} size={28} color={BrandColors.accentOrange} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.sub, { color: theme.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(240, 137, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: APP_FONTS.bold,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  sub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
});
