import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { EmptyState } from '@components/EmptyState';
import { earningsService } from '@api/services/earningsService';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { jobTypeLabel } from '@utils/jobHelpers';
import type { EarningsRecord, EarningsSummary } from '@domain/earnings.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, ProfileStackParamList } from '@navigation/types';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'Earnings'>
  | NativeStackScreenProps<ProfileStackParamList, 'Earnings'>;

type PeriodKey = 'today' | 'week' | 'month';

export function EarningsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [records, setRecords] = useState<EarningsRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void earningsService.fetchEarnings().then(data => {
      setSummary(data.summary);
      setRecords(data.records);
      setLoading(false);
    });
  }, []);

  const activePeriod = summary?.[selectedPeriod];

  const periodChips = useMemo(
    () =>
      (['today', 'week', 'month'] as PeriodKey[]).map(key => ({
        key,
        label: t(`earnings.${key}`),
      })),
    [t],
  );

  return (
    <ScreenScaffold
      title={t('earnings.title')}
      subtitle={t('earnings.subtitle')}
      onBack={() => navigation.goBack()}
      bottomInset={tabBarInset}
      loading={loading}>
      {summary ? (
        <>
          <View style={styles.periodRow}>
            {periodChips.map(chip => {
              const active = selectedPeriod === chip.key;
              return (
                <Pressable
                  key={chip.key}
                  onPress={() => setSelectedPeriod(chip.key)}
                  style={[
                    styles.periodChip,
                    {
                      backgroundColor: active ? BrandColors.accentOrange : theme.surface,
                      borderColor: active ? BrandColors.accentOrange : theme.cardBorder,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.periodChipText,
                      { color: active ? '#fff' : theme.textSecondary },
                    ]}>
                    {chip.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.heroCard, { backgroundColor: BrandColors.brandDeep }]}>
            <Text style={styles.heroLabel}>{t(`earnings.${selectedPeriod}`)}</Text>
            <Text style={styles.heroAmount}>AED {activePeriod?.amount_aed ?? 0}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <AppIcon name="route" size={14} color={BrandColors.accentOrange} />
                <Text style={styles.heroMetaText}>
                  {activePeriod?.trips ?? 0} {t('earnings.trips')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>{t('earnings.today')}</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>AED {summary.today.amount_aed}</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>{t('earnings.week')}</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>AED {summary.week.amount_aed}</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>{t('earnings.month')}</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>AED {summary.month.amount_aed}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('earnings.recent')}</Text>

          {records.length === 0 ? (
            <EmptyState title={t('earnings.emptyTitle')} subtitle={t('earnings.emptySub')} icon="wallet" />
          ) : (
            records.map(record => (
              <View
                key={record.id}
                style={[styles.recordCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <View style={styles.recordTop}>
                  <Text style={[styles.recordRef, { color: theme.text }]}>{record.booking_reference}</Text>
                  <Text style={styles.recordAmount}>+AED {record.amount_aed}</Text>
                </View>
                <Text style={[styles.recordCustomer, { color: theme.textSecondary }]}>
                  {record.customer_name}
                </Text>
                <View style={styles.recordBottom}>
                  <Text style={[styles.recordMeta, { color: theme.textMuted }]}>
                    {jobTypeLabel(record.job_type as Parameters<typeof jobTypeLabel>[0])}
                  </Text>
                  <Text style={[styles.recordMeta, { color: theme.textMuted }]}>{record.trip_date}</Text>
                </View>
              </View>
            ))
          )}
        </>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  periodChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodChipText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
  },
  heroCard: {
    borderRadius: Layout.cardRadius,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  heroLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  heroAmount: {
    fontFamily: APP_FONTS.bold,
    fontSize: 36,
    color: '#fff',
    marginTop: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: Spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 10,
  },
  statValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    marginBottom: Spacing.sm,
  },
  recordCard: {
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  recordTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordRef: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
  recordAmount: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    color: BrandColors.accentOrange,
  },
  recordCustomer: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    marginTop: 2,
  },
  recordBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  recordMeta: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
  },
});
