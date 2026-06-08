import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { useLanguage } from '@hooks/useLanguage';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  compact?: boolean;
};

export function ScreenHeader({ title, subtitle, onBack, compact }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { isRTL } = useLanguage();

  return (
    <View
      style={[
        styles.wrap,
        compact ? styles.wrapCompact : styles.wrapDefault,
        { paddingTop: insets.top + (compact ? Spacing.xs : Spacing.sm) },
      ]}>
      <View style={styles.appBarRow} accessibilityRole="header">
        <View style={styles.sideSlot}>
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
        </View>

        <View style={styles.centerSlot}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                compact && styles.subtitleCompact,
                { color: theme.textSecondary },
              ]}
              numberOfLines={compact ? 2 : 1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* keep space so title stays centered */}
        <View style={styles.sideSlot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.lg,
  },
  wrapDefault: {
    paddingBottom: Spacing.md,
  },
  wrapCompact: {
    paddingBottom: Spacing.xs,
  },
  appBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  sideSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontFamily: APP_FONTS.bold,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  subtitleCompact: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1,
  },
});
