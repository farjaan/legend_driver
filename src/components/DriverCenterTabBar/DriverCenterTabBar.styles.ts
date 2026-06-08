import { Platform, StyleSheet } from 'react-native';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { addAlpha, type ThemeTokens } from '@theme/index';
import { TAB_BAR_FAB_SIZE } from './DriverCenterTabBar.constants';

export type DriverTabBarColors = {
  active: string;
  inactive: string;
};

export function getDriverTabBarColors(theme: ThemeTokens): DriverTabBarColors {
  const isDark = theme.name === 'dark';
  return {
    active: BrandColors.accentOrange,
    inactive: isDark ? theme.textSecondary : BrandColors.brandPrimary,
  };
}

export function createDriverCenterTabBarStyles(theme: ThemeTokens) {
  const isDark = theme.name === 'dark';

  return StyleSheet.create({
    tabBarContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: theme.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? addAlpha(theme.border, 0.35) : addAlpha(theme.border, 0.55),
      shadowColor: isDark ? '#000000' : '#1A1024',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: isDark ? 0.45 : 0.08,
      shadowRadius: 12,
      elevation: 24,
    },
    safeAreaContainer: {
      backgroundColor: theme.surface,
    },
    tabBarContent: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: Platform.OS === 'ios' ? 6 : 4,
      paddingHorizontal: 8,
      minHeight: Platform.OS === 'ios' ? 62 : 56,
    },
    sideCluster: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
    },
    sideClusterRtl: {
      flexDirection: 'row-reverse',
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 2,
      minWidth: 56,
    },
    tabLabel: {
      fontSize: 10,
      fontFamily: APP_FONTS.bold,
      marginTop: 4,
      letterSpacing: 0.2,
    },
    fabSlot: {
      width: TAB_BAR_FAB_SIZE + 16,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 2,
    },
    fabOuter: {
      position: 'absolute',
      top: -22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fabButton: {
      width: TAB_BAR_FAB_SIZE,
      height: TAB_BAR_FAB_SIZE,
      borderRadius: TAB_BAR_FAB_SIZE / 2,
      backgroundColor: BrandColors.accentOrange,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: isDark ? 0 : 3,
      borderColor: '#FFFFFF',
      shadowColor: BrandColors.accentOrange,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.55 : 0.35,
      shadowRadius: isDark ? 14 : 10,
      elevation: 10,
    },
    fabButtonActive: {
      backgroundColor: BrandColors.brandDeep,
      shadowColor: BrandColors.brandDeep,
    },
    fabLabel: {
      marginTop: 35,
      fontSize: 10,
      fontFamily: APP_FONTS.bold,
      color: BrandColors.accentOrange,
      letterSpacing: 0.2,
    },
    fabLabelActive: {
      color: BrandColors.brandDeep,
    },
  });
}
