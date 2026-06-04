import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '@components/icons';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme, type ThemePreference } from '@theme/useAppTheme';
import { useTranslation } from 'react-i18next';

const OPTIONS: { key: ThemePreference; icon: string; labelKey: string }[] = [
  { key: 'light', icon: 'sun', labelKey: 'profile.themeLight' },
  { key: 'dark', icon: 'moon', labelKey: 'profile.themeDark' },
  { key: 'system', icon: 'mobile-alt', labelKey: 'profile.themeSystem' },
];

export function ThemePreferenceSelector() {
  const { t } = useTranslation();
  const { theme, themePreference, setThemePreference } = useAppTheme();

  return (
    <View style={styles.row}>
      {OPTIONS.map(opt => {
        const active = themePreference === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.chip,
              {
                backgroundColor: active ? BrandColors.brandDeep : theme.surface,
                borderColor: active ? BrandColors.brandDeep : theme.cardBorder,
              },
            ]}
            onPress={() => setThemePreference(opt.key)}
            activeOpacity={0.85}>
            <AppIcon
              name={opt.icon}
              size={14}
              color={active ? Colors.white : theme.textSecondary}
              solid={active}
            />
            <Text
              style={[
                styles.label,
                { color: active ? Colors.white : theme.text },
              ]}
              numberOfLines={1}>
              {t(opt.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontFamily: APP_FONTS.bold,
    fontSize: 11,
    lineHeight: 14,
  },
});
