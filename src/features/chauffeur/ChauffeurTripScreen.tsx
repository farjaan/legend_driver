import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { AppIcon } from '@components/icons';
import { SectionCard } from '@components/ui/SectionCard';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { StatusPill } from '@components/ui/StatusPill';
import { chauffeurService } from '@api/services/chauffeurService';
import { formatElapsed } from '@utils/format';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { ChauffeurTrip } from '@domain/chauffeur.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChauffeurTrip'>;

export function ChauffeurTripScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [trip, setTrip] = useState<ChauffeurTrip | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void chauffeurService.fetchTrip(route.params.jobId).then(data => {
      setTrip(data);
      setIsLoading(false);
    });
  }, [route.params.jobId]);

  const running = Boolean(trip?.started_at && !trip?.ended_at);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => {
    setTrip(prev =>
      prev ? { ...prev, started_at: new Date().toISOString() } : prev,
    );
    setElapsed(0);
  };

  const end = () => {
    setTrip(prev =>
      prev
        ? {
            ...prev,
            ended_at: new Date().toISOString(),
            distance_km: 12.4,
            elapsed_seconds: elapsed,
          }
        : prev,
    );
    setTimeout(() => {
      navigation.navigate('TripSummary', { jobId: route.params.jobId });
    }, 600);
  };

  const tripStatus = !trip?.started_at
    ? 'idle'
    : trip.ended_at
      ? 'done'
      : 'running';

  return (
    <ScreenScaffold
      title={t('chauffeur.tripTitle')}
      subtitle={trip?.booking_reference}
      onBack={() => navigation.goBack()}
      loading={isLoading}>
      {trip ? (
        <>
          <View style={styles.timerCard}>
            <StatusPill
              label={
                tripStatus === 'running'
                  ? t('chauffeur.inProgress')
                  : tripStatus === 'done'
                    ? t('chauffeur.completed')
                    : t('chauffeur.ready')
              }
              tone={tripStatus === 'running' ? 'active' : tripStatus === 'done' ? 'success' : 'neutral'}
            />
            <Text style={styles.timer}>{formatElapsed(elapsed)}</Text>
            <Text style={styles.timerLabel}>{t('chauffeur.timer')}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <AppIcon name="route" size={14} color={BrandColors.accentOrange} solid />
                <Text style={styles.statValue}>{trip.distance_km.toFixed(1)} km</Text>
              </View>
            </View>
          </View>

          {trip.policy_note ? (
            <Text style={[styles.policy, { color: theme.textSecondary }]}>{trip.policy_note}</Text>
          ) : null}

          <SectionCard title={t('chauffeur.stops')}>
            {trip.stops.map((stop, index) => (
              <View
                key={stop.id}
                style={[styles.stopRow, index < trip.stops.length - 1 && styles.stopBorder]}>
                <View style={styles.stopDot}>
                  <Text style={styles.stopNum}>{index + 1}</Text>
                </View>
                <View style={styles.stopBody}>
                  <Text style={[styles.stopLabel, { color: theme.text }]}>{stop.label}</Text>
                  <Text style={[styles.stopAddress, { color: theme.textSecondary }]}>
                    {stop.address}
                  </Text>
                </View>
              </View>
            ))}
          </SectionCard>

          {!trip.started_at ? (
            <PrimaryButton label={t('chauffeur.startTrip')} onPress={start} />
          ) : !trip.ended_at ? (
            <PrimaryButton label={t('chauffeur.endTrip')} onPress={end} />
          ) : (
            <View style={styles.doneBanner}>
              <AppIcon name="flag-checkered" size={18} color={Colors.success} solid />
              <Text style={styles.doneText}>{t('chauffeur.tripComplete')}</Text>
            </View>
          )}
        </>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  timerCard: {
    backgroundColor: BrandColors.brandDeep,
    borderRadius: Layout.cardRadius,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timer: {
    fontFamily: APP_FONTS.bold,
    fontSize: 42,
    color: Colors.white,
    lineHeight: 48,
    marginTop: Spacing.md,
    letterSpacing: 1,
  },
  timerLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    color: Colors.white,
  },
  policy: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  stopBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Layout.cardBorder,
  },
  stopDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BrandColors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stopNum: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    color: Colors.white,
  },
  stopBody: { flex: 1 },
  stopLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  stopAddress: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    marginBottom: Spacing.xl,
  },
  doneText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    color: Colors.success,
  },
});
