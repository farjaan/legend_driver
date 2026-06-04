import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { StatusPill } from '@components/ui/StatusPill';
import { useAuthStore } from '@store/authStore';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Compliance'>;

function daysUntil(dateIso: string): number | null {
  const ts = Date.parse(dateIso);
  if (!Number.isFinite(ts)) return null;
  const diff = ts - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function ComplianceScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const profile = useAuthStore(s => s.profile);

  const expiryDays = useMemo(() => (profile?.license_expiry ? daysUntil(profile.license_expiry) : null), [profile]);

  const expiryTone: 'neutral' | 'warning' | 'success' =
    expiryDays == null
      ? 'neutral'
      : expiryDays <= 7
        ? 'warning'
        : expiryDays <= 30
          ? 'warning'
          : 'success';

  return (
    <ScreenScaffold title={t('compliance.title')} subtitle={t('compliance.subtitle')} onBack={() => navigation.goBack()}>
      <SectionCard title={t('compliance.policyTitle')}>
        <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Text style={[styles.bannerTitle, { color: theme.text }]}>{t('compliance.speedTitle')}</Text>
          <Text style={[styles.bannerSub, { color: theme.textSecondary }]}>{t('compliance.speedBody')}</Text>
        </View>
        <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Text style={[styles.bannerTitle, { color: theme.text }]}>{t('compliance.routeTitle')}</Text>
          <Text style={[styles.bannerSub, { color: theme.textSecondary }]}>{t('compliance.routeBody')}</Text>
        </View>
      </SectionCard>

      <SectionCard title={t('compliance.documentsTitle')}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{t('compliance.licenseExpiry')}</Text>
          <StatusPill
            label={
              expiryDays == null
                ? t('compliance.unknown')
                : expiryDays < 0
                  ? t('compliance.expired')
                  : t('compliance.expiresIn', { days: expiryDays })
            }
            tone={expiryTone === 'success' ? 'success' : expiryTone === 'warning' ? 'warning' : 'neutral'}
          />
        </View>
        <Text style={[styles.value, { color: theme.text }]}>{profile?.license_expiry ?? '—'}</Text>
        <Text style={[styles.note, { color: theme.textSecondary }]}>{t('compliance.docsNote')}</Text>
      </SectionCard>

      <SectionCard title={t('compliance.safetyTitle')}>
        <View style={styles.safetyRow}>
          <View style={[styles.safetyDot, { backgroundColor: BrandColors.accentOrange }]} />
          <Text style={[styles.safetyText, { color: theme.text }]}>{t('compliance.safety1')}</Text>
        </View>
        <View style={styles.safetyRow}>
          <View style={[styles.safetyDot, { backgroundColor: Colors.success }]} />
          <Text style={[styles.safetyText, { color: theme.text }]}>{t('compliance.safety2')}</Text>
        </View>
        <View style={styles.safetyRow}>
          <View style={[styles.safetyDot, { backgroundColor: BrandColors.brandBurgundy }]} />
          <Text style={[styles.safetyText, { color: theme.text }]}>{t('compliance.safety3')}</Text>
        </View>
      </SectionCard>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Layout.cardRadius,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bannerTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  bannerSub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
  },
  value: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  note: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: Spacing.sm,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 8,
  },
  safetyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  safetyText: {
    flex: 1,
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});

