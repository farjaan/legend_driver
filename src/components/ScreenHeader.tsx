import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { useLanguage } from '@hooks/useLanguage';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, subtitle, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + Spacing.sm }]}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            { backgroundColor: theme.primarySoft, borderColor: theme.cardBorder },
          ]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <AppIcon
            name={isRTL ? 'chevron-right' : 'chevron-left'}
            size={16}
            color={theme.text}
            solid
          />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.badge}>LEGEND DRIVER</Text>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badge: {
    fontFamily: APP_FONTS.bold,
    fontSize: 9,
    letterSpacing: 2.2,
    color: BrandColors.accentOrange,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: APP_FONTS.bold,
    fontSize: 22,
    lineHeight: 26,
  },
  subtitle: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.xxs,
  },
});
