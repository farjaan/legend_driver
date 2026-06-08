import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { JobMapView, type MapPin } from '@components/map/JobMapView';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { StatusPill } from '@components/ui/StatusPill';
import { ContactCustomerSheet } from '@features/jobs/components/ContactCustomerSheet';
import { chauffeurService } from '@api/services/chauffeurService';
import { useJobStore } from '@store/jobStore';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { requestLocationPermission } from '@utils/requestLocationPermission';
import { formatJobSchedule } from '@utils/format';
import type { ChauffeurTrip } from '@domain/chauffeur.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChauffeurNavigation'>;

export function ChauffeurNavigationScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { jobId } = route.params;
  const job = useJobStore(s => s.getJob(jobId));
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const [trip, setTrip] = useState<ChauffeurTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [arriving, setArriving] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    void requestLocationPermission().then(setLocationGranted);
  }, []);

  useEffect(() => {
    void chauffeurService.fetchTrip(jobId).then(data => {
      setTrip(data);
      setLoading(false);
    });
    if (job?.job_status === 'accepted') {
      void chauffeurService.markEnRoute(jobId).then(() => fetchJobs());
    }
  }, [jobId, job?.job_status, fetchJobs]);

  const pickup = trip?.stops.find(s => s.type === 'pickup') ?? trip?.stops[0];
  const drop = trip?.stops.find(s => s.type === 'drop') ?? trip?.stops[trip.stops.length - 1];

  const pins = useMemo((): MapPin[] => {
    if (!trip || !pickup) return [];
    const list: MapPin[] = [
      {
        id: 'pickup',
        latitude: pickup.latitude,
        longitude: pickup.longitude,
        title: pickup.label,
        description: pickup.address,
        variant: 'pickup',
      },
    ];
    if (drop && drop.id !== pickup.id) {
      list.push({
        id: 'drop',
        latitude: drop.latitude,
        longitude: drop.longitude,
        title: drop.label,
        description: drop.address,
        variant: 'drop',
      });
    }
    return list;
  }, [trip, pickup, drop]);

  const routeCoordinates = useMemo(() => {
    if (!pickup || !drop) return [];
    const midLat = (pickup.latitude + drop.latitude) / 2 + 0.004;
    const midLng = (pickup.longitude + drop.longitude) / 2 - 0.003;
    return [
      { latitude: pickup.latitude, longitude: pickup.longitude },
      { latitude: midLat, longitude: midLng },
      { latitude: drop.latitude, longitude: drop.longitude },
    ];
  }, [pickup, drop]);

  const openMaps = () => {
    if (!pickup) return;
    void Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${pickup.latitude},${pickup.longitude}`,
    );
  };

  const markArrived = async () => {
    setArriving(true);
    try {
      const updated = await chauffeurService.arriveAtPickup(jobId);
      await fetchJobs();
      navigation.replace('ChauffeurStartTrip', { jobId });
      setTrip(updated);
    } finally {
      setArriving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.screenBackground }]}>
        <ActivityIndicator color={BrandColors.accentOrange} />
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
          <Text style={styles.topTitle}>{t('chauffeur.navigationTitle')}</Text>
          <Text style={styles.topSub}>{trip?.booking_reference}</Text>
        </View>
        <StatusPill label={t('chauffeur.enRoute')} tone="active" />
      </SafeAreaView>

      <View style={[styles.bottomPanel, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <Text style={[styles.customerName, { color: theme.text }]}>{trip?.customer_name}</Text>
        <Text style={[styles.vehicle, { color: theme.textSecondary }]}>{trip?.vehicle_label}</Text>

        <View style={styles.addressBlock}>
          <AppIcon name="map-marker-alt" size={14} color={BrandColors.accentOrange} solid />
          <View style={styles.addressText}>
            <Text style={[styles.addressLabel, { color: theme.textMuted }]}>
              {t('chauffeur.pickup')}
            </Text>
            <Text style={[styles.addressValue, { color: theme.text }]} numberOfLines={2}>
              {pickup?.address}
            </Text>
            <Text style={styles.schedule}>{formatJobSchedule(trip?.scheduled_at ?? '')}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.secondaryBtn, { borderColor: theme.cardBorder }]}
            onPress={() => setContactVisible(true)}>
            <AppIcon name="phone" size={16} color={BrandColors.accentOrange} solid />
            <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
              {t('contact.call')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryBtn, { borderColor: theme.cardBorder }]}
            onPress={openMaps}>
            <AppIcon name="directions" size={16} color={BrandColors.accentOrange} solid />
            <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
              {t('jobs.openInMaps')}
            </Text>
          </Pressable>
        </View>

        <PrimaryButton
          label={t('chauffeur.arrived')}
          onPress={markArrived}
          loading={arriving}
          style={styles.arrivedBtn}
        />
      </View>

      <ContactCustomerSheet
        visible={contactVisible}
        maskedPhone={trip?.customer_phone_masked ?? job?.customer_phone_masked ?? ''}
        onClose={() => setContactVisible(false)}
      />
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
  customerName: {
    fontFamily: APP_FONTS.bold,
    fontSize: 18,
  },
  vehicle: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  addressBlock: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  addressText: { flex: 1 },
  addressLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
  },
  addressValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 2,
  },
  schedule: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    color: BrandColors.accentOrange,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
  },
  arrivedBtn: {},
});
