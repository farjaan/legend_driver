import React, { useMemo } from 'react';
import { Switch, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { ThemePreferenceSelector } from '@components/settings/ThemePreferenceSelector';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useLanguage } from '@hooks/useLanguage';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScreenScaffold
      title={t('profile.settings')}
      subtitle={t('profile.settingsSub')}
      onBack={() => navigation.goBack()}>
      <SectionCard title={t('profile.preferences')}>
        <Text style={styles.sectionLabel}>{t('profile.appearance')}</Text>
        <ThemePreferenceSelector />

        <View style={[styles.row, styles.rowSpaced]}>
          <Text style={styles.rowLabel}>{t('profile.language')}</Text>
          <Text
            style={styles.rowValue}
            onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'English' : 'العربية'} ›
          </Text>
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>{t('profile.pushNotifications')}</Text>
          <Switch
            value
            trackColor={{ false: theme.cardBorder, true: BrandColors.accentOrange }}
            thumbColor="#fff"
          />
        </View>
      </SectionCard>

      <SectionCard title={t('profile.about')}>
        <Text style={styles.about}>Legend Driver · v1.0.0</Text>
        <Text style={styles.aboutSub}>{t('profile.aboutSub')}</Text>
      </SectionCard>
    </ScreenScaffold>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    sectionLabel: {
      fontFamily: APP_FONTS.bold,
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: Spacing.sm,
      lineHeight: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.cardBorder,
    },
    rowSpaced: {
      marginTop: Spacing.md,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowLabel: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.text,
    },
    rowValue: {
      fontFamily: APP_FONTS.bold,
      fontSize: 13,
      color: BrandColors.accentOrange,
    },
    about: {
      fontFamily: APP_FONTS.bold,
      fontSize: 14,
      color: theme.text,
    },
    aboutSub: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
      lineHeight: 17,
    },
  });
}
