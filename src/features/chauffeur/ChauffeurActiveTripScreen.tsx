import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { JobMapView } from '@components/map/JobMapView';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { StatusPill } from '@components/ui/StatusPill';
import { chauffeurService } from '@api/services/chauffeurService';
import { useJobStore } from '@store/jobStore';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { requestLocationPermission } from '@utils/requestLocationPermission';
import { formatElapsed } from '@utils/format';
import type { ChauffeurTrip } from '@domain/chauffeur.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChauffeurActiveTrip'>;

export function ChauffeurActiveTripScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { jobId } = route.params;
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const [trip, setTrip] = useState<ChauffeurTrip | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    void requestLocationPermission().then(setLocationGranted);
  }, []);

  useEffect(() => {
    void chauffeurService.fetchTrip(jobId).then(data => {
      setTrip(data);
      setElapsed(data.elapsed_seconds);
      setDistanceKm(data.distance_km);
      setLoading(false);
    });
  }, [jobId]);

  useEffect(() => {
    if (!trip?.started_at || trip.ended_at) return;
    const tick = setInterval(() => {
      setElapsed(e => e + 1);
      setDistanceKm(d => Math.round((d + 0.02) * 10) / 10);
    }, 1000);
    return () => clearInterval(tick);
  }, [trip?.started_at, trip?.ended_at]);

  const pickup = trip?.stops.find(s => s.type === 'pickup') ?? trip?.stops[0];
  const drop = trip?.stops.find(s => s.type === 'drop') ?? trip?.stops[trip?.stops.length - 1];

  const pins = useMemo(() => {
    if (!pickup || !drop) return [];
    return [
      {
        id: 'pickup',
        latitude: pickup.latitude,
        longitude: pickup.longitude,
        title: pickup.label,
        description: pickup.address,
        variant: 'pickup' as const,
      },
      {
        id: 'drop',
        latitude: drop.latitude,
        longitude: drop.longitude,
        title: drop.label,
        description: drop.address,
        variant: 'drop' as const,
      },
    ];
  }, [pickup, drop]);

  const routeCoordinates = useMemo(() => {
    if (!pickup || !drop) return [];
    return [
      { latitude: pickup.latitude, longitude: pickup.longitude },
      { latitude: (pickup.latitude + drop.latitude) / 2, longitude: (pickup.longitude + drop.longitude) / 2 },
      { latitude: drop.latitude, longitude: drop.longitude },
    ];
  }, [pickup, drop]);

  const callEmergency = () => {
    const phone = trip?.emergency_contact.phone.replace(/\s/g, '') ?? '+971800534363';
    void Linking.openURL(`tel:${phone}`);
  };

  const completeRide = async () => {
    setEnding(true);
    try {
      await chauffeurService.endTrip(jobId, elapsed);
      await fetchJobs();
      navigation.replace('TripSummary', { jobId });
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.screenBackground }]}>
        <Text style={{ color: theme.textSecondary }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <JobMapView
        pins={pins}
        routeCoordinates={routeCoordinates}
        fullScreen
        showUserLocation={locationGranted}
      />

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppIcon name="arrow-left" size={18} color="#fff" />
        </Pressable>
        <View style={styles.topInfo}>
          <Text style={styles.topTitle}>{t('chauffeur.activeTripTitle')}</Text>
          <Text style={styles.topSub}>{trip?.booking_reference}</Text>
        </View>
        <StatusPill label={t('chauffeur.inProgress')} tone="active" />
      </SafeAreaView>

      <View style={[styles.statsBar, { backgroundColor: BrandColors.brandDeep }]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatElapsed(elapsed)}</Text>
          <Text style={styles.statLabel}>{t('chauffeur.timer')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{distanceKm.toFixed(1)} km</Text>
          <Text style={styles.statLabel}>{t('chauffeur.distance')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{trip?.customer_name.split(' ')[0]}</Text>
          <Text style={styles.statLabel}>{t('jobs.customer')}</Text>
        </View>
      </View>

      <View style={[styles.bottomPanel, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <Pressable style={[styles.emergencyBtn, { borderColor: Colors.danger }]} onPress={callEmergency}>
          <AppIcon name="phone-alt" size={16} color={Colors.danger} solid />
          <View style={styles.emergencyText}>
            <Text style={[styles.emergencyTitle, { color: theme.text }]}>
              {t('chauffeur.emergencyContact')}
            </Text>
            <Text style={[styles.emergencySub, { color: theme.textSecondary }]}>
              {trip?.emergency_contact.name} · {trip?.emergency_contact.phone}
            </Text>
          </View>
        </Pressable>

        <PrimaryButton
          label={t('chauffeur.completeRide')}
          onPress={completeRide}
          loading={ending}
          style={styles.completeBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(44,27,71,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topInfo: { flex: 1 },
  topTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  topSub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  statsBar: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    top: '38%',
    flexDirection: 'row',
    borderRadius: Layout.cardRadius,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 16,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: Layout.cardRadius,
    borderTopRightRadius: Layout.cardRadius,
    borderWidth: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(220,38,38,0.06)',
  },
  emergencyText: { flex: 1 },
  emergencyTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
  emergencySub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  completeBtn: {},
});
