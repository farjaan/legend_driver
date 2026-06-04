import { StyleSheet } from 'react-native';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import type { ThemeTokens } from '@theme/index';

export function createCardStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Layout.cardPadding,
      marginBottom: Layout.listGap,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    cardPressed: {
      opacity: 0.92,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: APP_FONTS.bold,
      fontSize: 15,
      color: theme.name === 'dark' ? theme.text : BrandColors.brandDeep,
      lineHeight: 20,
    },
    subtitle: {
      fontFamily: APP_FONTS.regular,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
      marginTop: Spacing.xxs,
    },
    meta: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textMuted,
      lineHeight: 16,
      marginTop: Spacing.xxs,
    },
    iconBox: {
      width: Layout.iconBox,
      height: Layout.iconBox,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(240, 137, 0, 0.12)',
      marginRight: Spacing.md,
    },
  });
}

export type CardStyles = ReturnType<typeof createCardStyles>;
