import React, { useMemo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { JobMapView } from '@components/map/JobMapView';
import { SectionCard } from '@components/ui/SectionCard';
import { DetailRow } from '@components/ui/DetailRow';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { useJobStore } from '@store/jobStore';
import { APP_FONTS } from '@constants/appFonts';
import { useAppTheme } from '@theme/useAppTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobMap'>;

export function JobMapScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const job = useJobStore(s => s.getJob(route.params.jobId));

  const pins = useMemo(() => {
    if (!job) return [];
    return [
      {
        id: 'customer',
        latitude: job.latitude,
        longitude: job.longitude,
        title: job.customer_name,
        description: job.drop_off_address ?? job.pick_up_address,
        variant: 'customer' as const,
      },
      {
        id: 'branch',
        latitude: job.latitude + 0.018,
        longitude: job.longitude - 0.022,
        title: job.branch_name,
        description: t('jobs.branch'),
        variant: 'branch' as const,
      },
    ];
  }, [job, t]);

  if (!job) {
    return (
      <ScreenScaffold title={t('jobs.mapPreview')} onBack={() => navigation.goBack()}>
        <Text style={[styles.notFound, { color: theme.textSecondary }]}>{t('jobs.notFound')}</Text>
      </ScreenScaffold>
    );
  }

  const openMaps = () => {
    void Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`,
    );
  };

  return (
    <ScreenScaffold
      title={t('jobs.mapPreview')}
      subtitle={job.booking_reference}
      onBack={() => navigation.goBack()}>
      <JobMapView pins={pins} height={300} />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotCustomer]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>{t('jobs.customerPin')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotBranch]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>{t('jobs.branch')}</Text>
        </View>
      </View>

      <SectionCard title={t('jobs.routeInfo')}>
        <DetailRow icon="building" label={t('jobs.branch')} value={job.branch_name} />
        <DetailRow
          icon="map-marker-alt"
          label={t('jobs.destination')}
          value={job.drop_off_address ?? job.pick_up_address ?? '—'}
          last
        />
      </SectionCard>

      <PrimaryButton label={t('jobs.openInMaps')} onPress={openMaps} />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  notFound: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotCustomer: {
    backgroundColor: '#F08900',
  },
  dotBranch: {
    backgroundColor: '#2C1B47',
  },
  legendText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
  },
});
