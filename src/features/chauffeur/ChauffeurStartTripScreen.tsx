import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { DetailRow } from '@components/ui/DetailRow';
import { OtpCodeInput } from '@components/ui/OtpCodeInput';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { StatusPill } from '@components/ui/StatusPill';
import { chauffeurService } from '@api/services/chauffeurService';
import { useJobStore } from '@store/jobStore';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { formatJobSchedule } from '@utils/format';
import type { ChauffeurTrip } from '@domain/chauffeur.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChauffeurStartTrip'>;

export function ChauffeurStartTripScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { jobId } = route.params;
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const [trip, setTrip] = useState<ChauffeurTrip | null>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    void chauffeurService.fetchTrip(jobId).then(data => {
      setTrip(data);
      setLoading(false);
    });
  }, [jobId]);

  const pickup = trip?.stops.find(s => s.type === 'pickup') ?? trip?.stops[0];
  const drop = trip?.stops.find(s => s.type === 'drop') ?? trip?.stops[trip?.stops.length - 1];

  const startRide = async () => {
    if (otp.length < 6) return;
    setStarting(true);
    setError('');
    try {
      const res = await chauffeurService.startTrip(jobId, otp);
      if (!('trip_id' in res)) {
        setError('message' in res ? String(res.message) : t('auth.invalidOtp'));
        return;
      }
      await fetchJobs();
      navigation.replace('ChauffeurActiveTrip', { jobId });
    } finally {
      setStarting(false);
    }
  };

  return (
    <ScreenScaffold
      title={t('chauffeur.startTripTitle')}
      subtitle={trip?.booking_reference}
      onBack={() => navigation.goBack()}
      loading={loading}>
      {trip ? (
        <>
          <View style={styles.statusRow}>
            <StatusPill label={t('chauffeur.arrivedAtPickup')} tone="success" />
          </View>

          <SectionCard title={t('chauffeur.rideDetails')}>
            <DetailRow icon="user" label={t('jobs.customer')} value={trip.customer_name} />
            <DetailRow icon="car" label={t('chauffeur.vehicle')} value={trip.vehicle_label} />
            <DetailRow
              icon="map-marker-alt"
              label={t('chauffeur.pickup')}
              value={pickup?.address ?? '—'}
            />
            <DetailRow
              icon="flag-checkered"
              label={t('chauffeur.dropoff')}
              value={drop?.address ?? '—'}
            />
            <DetailRow
              icon="clock"
              label={t('chauffeur.tripTime')}
              value={formatJobSchedule(trip.scheduled_at)}
              last
            />
          </SectionCard>

          <SectionCard title={t('chauffeur.otpVerifyTitle')}>
            <Text style={[styles.otpHint, { color: theme.textSecondary }]}>
              {t('chauffeur.otpVerifyHint')}
            </Text>
            <OtpCodeInput autoFocus parentPadding={28} onChange={setOtp} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </SectionCard>

          <PrimaryButton
            label={t('chauffeur.startRide')}
            onPress={startRide}
            loading={starting}
            disabled={otp.length < 6}
            style={styles.startBtn}
          />
        </>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    marginBottom: Spacing.md,
  },
  otpHint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  error: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: BrandColors.brandBurgundyDeep,
    marginTop: Spacing.sm,
  },
  startBtn: {
    marginBottom: Spacing.xl,
  },
});
