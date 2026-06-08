import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '@components/ScreenHeader';
import { JobMapView } from '@components/map/JobMapView';
import { DetailRow } from '@components/ui/DetailRow';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { useJobStore } from '@store/jobStore';
import { APP_FONTS } from '@constants/appFonts';
import { useAppTheme } from '@theme/useAppTheme';
import { requestLocationPermission } from '@utils/requestLocationPermission';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobMap'>;

export function JobMapScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { height: windowHeight } = useWindowDimensions();
  const job = useJobStore(s => s.getJob(route.params.jobId));
  const [locationGranted, setLocationGranted] = useState(false);

  const mapHeight = Math.max(Math.round(windowHeight * 0.48), 300);

  useEffect(() => {
    void requestLocationPermission().then(setLocationGranted);
  }, []);

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
      <View style={[styles.root, { backgroundColor: theme.screenBackground }]}>
        <ScreenHeader title={t('jobs.mapPreview')} onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text style={[styles.notFound, { color: theme.textSecondary }]}>
            {t('jobs.notFound')}
          </Text>
        </View>
      </View>
    );
  }

  const openMaps = () => {
    void Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`,
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.screenBackground }]}>
      <ScreenHeader
        title={t('jobs.mapPreview')}
        subtitle={job.booking_reference}
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <JobMapView
          pins={pins}
          height={mapHeight}
          showUserLocation={locationGranted}
        />
      </View>

      {Platform.OS === 'android' ? (
        <Text style={[styles.mapHint, { color: theme.textMuted }]}>
          {locationGranted ? t('map.tilesHint') : t('map.permissionOptional')}
        </Text>
      ) : null}

      <View style={[styles.bottomPanel, { backgroundColor: theme.screenBackground, borderTopColor: theme.cardBorder }]}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.dotCustomer]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              {t('jobs.customerPin')}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.dotBranch]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              {t('jobs.branch')}
            </Text>
          </View>
        </View>

        <DetailRow icon="building" label={t('jobs.branch')} value={job.branch_name} />
        <DetailRow
          icon="map-marker-alt"
          label={t('jobs.destination')}
          value={job.drop_off_address ?? job.pick_up_address ?? '—'}
          last
        />

        <PrimaryButton label={t('jobs.openInMaps')} onPress={openMaps} style={styles.mapsBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
  },
  mapContainer: {
    width: '100%',
  },
  mapHint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  bottomPanel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  mapsBtn: {
    marginTop: 8,
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
