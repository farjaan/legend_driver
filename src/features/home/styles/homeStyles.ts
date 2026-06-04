import { StyleSheet } from 'react-native';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { addAlpha, type ThemeTokens } from '@theme/index';

export const createHomeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.screenBackground,
    },
    scroll: {
      paddingHorizontal: Spacing.lg,
    },
    header: {
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
    },
    greeting: {
      fontFamily: APP_FONTS.regular,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    driverName: {
      fontFamily: APP_FONTS.bold,
      fontSize: 24,
      color: theme.text,
      lineHeight: 28,
      marginTop: 2,
    },
    heroCard: {
      borderRadius: 18,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      overflow: 'hidden',
      backgroundColor: BrandColors.brandDeep,
    },
    heroGlow: {
      position: 'absolute',
      right: -30,
      top: -30,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: addAlpha(BrandColors.accentOrange, 0.35),
    },
    heroRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroLabel: {
      color: 'rgba(255,255,255,0.75)',
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      lineHeight: 16,
    },
    heroStatus: {
      color: '#fff',
      fontFamily: APP_FONTS.bold,
      fontSize: 20,
      lineHeight: 24,
      marginTop: 2,
    },
    onlinePill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.14)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.22)',
    },
    onlinePillActive: {
      backgroundColor: addAlpha(BrandColors.accentOrange, 0.9),
      borderColor: BrandColors.accentOrange,
    },
    onlinePillText: {
      color: '#fff',
      fontFamily: APP_FONTS.bold,
      fontSize: 11,
      letterSpacing: 0.4,
    },
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
      
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    statValue: {
      fontFamily: APP_FONTS.bold,
      fontSize: 20,
      color: theme.text,
      lineHeight: 24,
      marginTop: Spacing.sm,
      textAlign: 'center',
    },
    statLabel: {
      fontFamily: APP_FONTS.regular,
      fontSize: 11,
      color: theme.textSecondary,
      lineHeight: 14,
      marginTop: 1,
      textAlign: 'center',
    },
    earningsNote: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontFamily: APP_FONTS.bold,
      fontSize: 15,
      color: theme.text,
      lineHeight: 20,
      marginBottom: Spacing.sm,
    },
    actionCard: {
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    actionIcon: {
      width: Layout.iconBox,
      height: Layout.iconBox,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: addAlpha(BrandColors.accentOrange, 0.12),
      marginRight: Spacing.md,
    },
    actionTitle: {
      fontFamily: APP_FONTS.bold,
      fontSize: 14,
      color: theme.text,
      lineHeight: 18,
    },
    actionSub: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
      marginTop: 1,
    },
    shiftBtn: {
      marginTop: Spacing.sm,
      height: 44,
      borderRadius: 12,
      backgroundColor: BrandColors.accentOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shiftBtnOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: BrandColors.accentOrange,
      marginTop: Spacing.sm,
    },
    shiftBtnText: {
      color: Colors.white,
      fontFamily: APP_FONTS.bold,
      fontSize: 14,
      lineHeight: 18,
    },
    shiftBtnTextOutline: {
      color: BrandColors.accentOrange,
    },
  });

export type HomeStyles = ReturnType<typeof createHomeStyles>;
