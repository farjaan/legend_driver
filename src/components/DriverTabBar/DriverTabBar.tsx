import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { addAlpha } from '@theme/index';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import { TAB_BAR_HEIGHT } from './DriverTabBar.constants';

export type DriverTabKey = 'home' | 'jobs' | 'chat' | 'profile';

type TabConfig = {
  key: DriverTabKey;
  label: string;
  icon: string;
};

type Props = {
  activeTab: DriverTabKey | null;
  tabs: TabConfig[];
  onPress: (key: DriverTabKey) => void;
};

export function DriverTabBar({ activeTab, tabs, onPress }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={styles.safe}>
        <View style={styles.row}>
          {tabs.map(tab => {
            const focused = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                onPress={() => onPress(tab.key)}
                style={styles.tab}
                activeOpacity={0.8}>
                <View style={[styles.iconBubble, focused && styles.iconBubbleActive]}>
                  <AppIcon
                    name={tab.icon}
                    size={focused ? 19 : 18}
                    color={focused ? '#fff' : theme.textMuted}
                    solid={focused}
                  />
                </View>
                <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

function createStyles(theme: ThemeTokens) {
  const isDark = theme.name === 'dark';
  return StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.cardBorder,
      shadowColor: '#1A1024',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: isDark ? 0.35 : 0.08,
      shadowRadius: 10,
      elevation: 16,
    },
    safe: {
      minHeight: TAB_BAR_HEIGHT,
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.xs,
      paddingHorizontal: Spacing.sm,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
    },
    iconBubble: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    iconBubbleActive: {
      backgroundColor: BrandColors.accentOrange,
      borderWidth: 2,
      borderColor: addAlpha('#FFFFFF', 0.35),
      shadowColor: BrandColors.accentOrange,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.45 : 0.32,
      shadowRadius: 10,
      elevation: 8,
    },
    label: {
      fontFamily: APP_FONTS.regular,
      fontSize: 10,
      color: theme.textMuted,
      lineHeight: 13,
    },
    labelActive: {
      fontFamily: APP_FONTS.bold,
      color: BrandColors.accentOrange,
    },
  });
}
