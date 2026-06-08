import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { NetworkImage } from '@components/NetworkImage';
import { StatusPill } from '@components/ui/StatusPill';
import { SectionCard } from '@components/ui/SectionCard';
import { DetailRow } from '@components/ui/DetailRow';
import { ActionTile } from '@components/ui/ActionTile';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { JobStatusTimeline } from '@features/jobs/components/JobStatusTimeline';
import { RejectReasonModal } from '@features/jobs/components/RejectReasonModal';
import { ContactCustomerSheet } from '@features/jobs/components/ContactCustomerSheet';
import { jobService } from '@api/services/jobService';
import type { BookingSummary } from '@api/models/booking.models';
import { useJobStore } from '@store/jobStore';
import { jobTypeLabel, nextStatus } from '@utils/jobHelpers';
import {
  chauffeurPrimaryActionKey,
  isChauffeurJob,
  navigateChauffeurFlow,
} from '@utils/chauffeurHelpers';
import { formatJobSchedule } from '@utils/format';
import { getVehicleImageProps } from '@utils/vehicleImage';
import { PlaceholderImages } from '@assets/placeholders';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { DriverJob } from '@domain/job.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

export function JobDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { jobId } = route.params;
  const cachedJob = useJobStore(s => s.getJob(jobId));
  const acceptJob = useJobStore(s => s.acceptJob);
  const rejectJob = useJobStore(s => s.rejectJob);
  const advanceStatus = useJobStore(s => s.advanceStatus);
  const [job, setJob] = useState<DriverJob | null>(cachedJob ?? null);
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [contactSheetVisible, setContactSheetVisible] = useState(false);

  useEffect(() => {
    void jobService.fetchJobDetail(jobId).then(result => {
      if (result) {
        setJob(result.job);
        setBooking(result.booking);
      }
      setLoading(false);
    });
  }, [jobId]);

  useEffect(() => {
    const fresh = useJobStore.getState().getJob(jobId);
    if (fresh) setJob(fresh);
  }, [jobId, cachedJob?.job_status]);

  const isChauffeur = job ? isChauffeurJob(job) : false;
  const chauffeurActionKey = job ? chauffeurPrimaryActionKey(job.job_status) : null;

  const handleChauffeurPrimary = () => {
    if (!job) return;
    navigateChauffeurFlow(navigation, job);
  };

  const advance = () => {
    if (!job) return;
    const next = nextStatus(job.job_status);
    if (next) void advanceStatus(jobId, next);
  };

  const handleAccept = async () => {
    await acceptJob(jobId);
    const updated = useJobStore.getState().getJob(jobId);
    if (updated) setJob(updated);
    if (updated && isChauffeurJob(updated)) {
      navigation.navigate('ChauffeurNavigation', { jobId });
    }
  };

  if (!loading && !job) {
    return (
      <ScreenScaffold
        title={t('jobs.detail')}
        onBack={() => navigation.goBack()}>
        <Text style={[styles.notFound, { color: theme.textSecondary }]}>{t('jobs.notFound')}</Text>
      </ScreenScaffold>
    );
  }

  const address = job?.drop_off_address ?? job?.pick_up_address ?? '—';

  return (
    <ScreenScaffold
      title={job?.booking_reference ?? t('jobs.detail')}
      subtitle={
        job
          ? `${t(`jobs.status.${job.job_status}`)} · ${formatJobSchedule(job.scheduled_at)}`
          : undefined
      }
      onBack={() => navigation.goBack()}
      loading={loading}>
      {job ? (
        <>
          <View style={styles.heroWrap}>
            <NetworkImage
              {...getVehicleImageProps(job.vehicle)}
              fallbackSource={PlaceholderImages.carFront}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.12)', 'rgba(44, 27, 71, 0.92)']}
              style={styles.heroGradient}
              pointerEvents="none"
            />
            <View style={styles.heroOverlay}>
              <View style={styles.heroChips}>
                <StatusPill
                  label={t(`jobs.priority.${job.priority}`)}
                  tone={job.priority === 'urgent' ? 'warning' : 'active'}
                />
                <StatusPill label={jobTypeLabel(job.job_type)} tone="neutral" />
              </View>
              <Text style={styles.heroVehicle}>
                {job.vehicle.make} {job.vehicle.model}
              </Text>
              <Text style={styles.heroPlate}>{job.vehicle.plate_number}</Text>
            </View>
          </View>

          <JobStatusTimeline current={job.job_status} />

          {isChauffeur ? (
            <SectionCard title={t('chauffeur.rideDetails')}>
              <DetailRow icon="user" label={t('jobs.customer')} value={job.customer_name} />
              <DetailRow
                icon="phone"
                label={t('jobs.phone')}
                value={job.customer_phone_masked}
                onPress={() => setContactSheetVisible(true)}
              />
              <DetailRow
                icon="car"
                label={t('chauffeur.vehicle')}
                value={`${job.vehicle.make} ${job.vehicle.model} · ${job.vehicle.plate_number}`}
              />
              <DetailRow
                icon="palette"
                label={t('chauffeur.vehicleColor')}
                value={job.vehicle.color}
              />
              <DetailRow
                icon="map-marker-alt"
                label={t('chauffeur.pickup')}
                value={job.pick_up_address ?? '—'}
              />
              <DetailRow
                icon="flag-checkered"
                label={t('chauffeur.dropoff')}
                value={job.drop_off_address ?? '—'}
              />
              <DetailRow
                icon="clock"
                label={t('chauffeur.tripTime')}
                value={formatJobSchedule(job.scheduled_at)}
                last
              />
            </SectionCard>
          ) : (
            <SectionCard title={t('jobs.customerSection')}>
              <DetailRow icon="user" label={t('jobs.customer')} value={job.customer_name} />
              <DetailRow
                icon="phone"
                label={t('jobs.phone')}
                value={job.customer_phone_masked}
                onPress={() => setContactSheetVisible(true)}
              />
              <DetailRow icon="map-marker-alt" label={t('jobs.location')} value={address} />
              <DetailRow icon="building" label={t('jobs.branch')} value={job.branch_name} last />
            </SectionCard>
          )}

          {booking ? (
            <SectionCard title={t('jobs.bookingSection')}>
              <View style={[styles.amountRow, { borderBottomColor: theme.cardBorder }]}>
                <View>
                  <Text style={[styles.amountLabel, { color: theme.textMuted }]}>{t('jobs.total')}</Text>
                  <Text style={[styles.amountValue, { color: theme.text }]}>AED {booking.total_amount}</Text>
                </View>
                <View style={styles.amountDue}>
                  <Text style={[styles.amountLabel, { color: theme.textMuted }]}>{t('jobs.due')}</Text>
                  <Text style={[styles.amountValue, styles.dueHighlight]}>
                    AED {booking.due_amount}
                  </Text>
                </View>
              </View>
              <DetailRow
                icon="calendar-alt"
                label={t('jobs.rentalPeriod')}
                value={`${booking.pick_up_date} ${booking.pick_up_time} → ${booking.drop_off_date} ${booking.drop_off_time}`}
              />
              <DetailRow
                icon="clock"
                label={t('jobs.duration')}
                value={`${booking.total_days} ${t('jobs.days')}`}
              />
              <DetailRow
                icon="credit-card"
                label={t('jobs.payment')}
                value={`${booking.payment_status} · ${booking.booking_type}`}
                last
              />
            </SectionCard>
          ) : null}

          <Text style={styles.actionsTitle}>{t('jobs.actions')}</Text>
          <View style={styles.actionGrid}>
            <ActionTile
              icon="phone"
              label={t('contact.call')}
              onPress={() => setContactSheetVisible(true)}
            />
            {isChauffeur ? (
              <ActionTile
                icon="route"
                label={t('chauffeur.navigationTitle')}
                onPress={() => navigation.navigate('ChauffeurNavigation', { jobId })}
              />
            ) : (
              <ActionTile
                icon="map"
                label={t('jobs.mapPreview')}
                onPress={() => navigation.navigate('JobMap', { jobId })}
              />
            )}
            {!isChauffeur ? (
              <ActionTile
                icon="shield-alt"
                label={t('verify.otp')}
                onPress={() => navigation.navigate('HandoverVerify', { jobId })}
              />
            ) : null}
            {job.job_type === 'delivery' || job.job_type === 'pickup' ? (
              <ActionTile
                icon="car"
                label={t('handover.checkoutTitle')}
                onPress={() => navigation.navigate('CheckoutWizard', { jobId })}
              />
            ) : null}
            {job.job_type === 'return_collection' ? (
              <ActionTile
                icon="undo"
                label={t('handover.checkinTitle')}
                onPress={() => navigation.navigate('CheckinWizard', { jobId })}
              />
            ) : null}
          </View>

          {job.job_status === 'assigned' ? (
            <View style={styles.ctaRow}>
              <PrimaryButton
                label={isChauffeur ? t('chauffeur.acceptRide') : t('jobs.accept')}
                onPress={() => void handleAccept()}
                style={styles.ctaFlex}
              />
              <PrimaryButton
                label={isChauffeur ? t('chauffeur.rejectRide') : t('jobs.reject')}
                variant="danger"
                onPress={() => setRejectModalVisible(true)}
                style={styles.ctaFlex}
              />
            </View>
          ) : chauffeurActionKey ? (
            <PrimaryButton
              label={t(chauffeurActionKey)}
              onPress={handleChauffeurPrimary}
              style={styles.ctaSingle}
            />
          ) : !isChauffeur &&
            job.job_status !== 'completed' &&
            job.job_status !== 'rejected' &&
            job.job_status !== 'cancelled' ? (
            <PrimaryButton
              label={t('jobs.advanceStatus')}
              onPress={advance}
              style={styles.ctaSingle}
            />
          ) : null}
        </>
      ) : null}

      <RejectReasonModal
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onConfirm={reason => {
          setRejectModalVisible(false);
          void rejectJob(jobId, reason);
        }}
      />

      {job ? (
        <ContactCustomerSheet
          visible={contactSheetVisible}
          maskedPhone={job.customer_phone_masked}
          onClose={() => setContactSheetVisible(false)}
        />
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  notFound: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
  },
  heroWrap: {
    height: 200,
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    backgroundColor: BrandColors.brandDeep,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.md,
    zIndex: 2,
  },
  heroChips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  heroVehicle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 18,
    color: Colors.white,
    lineHeight: 22,
  },
  heroPlate: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  amountLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
    lineHeight: 14,
  },
  amountValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 18,
    lineHeight: 22,
    marginTop: 2,
  },
  amountDue: { alignItems: 'flex-end' },
  dueHighlight: {
    color: BrandColors.accentOrange,
  },
  actionsTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    color: BrandColors.brandDeep,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ctaFlex: { flex: 1 },
  ctaSingle: { marginBottom: Spacing.lg },
});
