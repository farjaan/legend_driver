import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
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
import { nextStatus, jobTypeLabel } from '@utils/jobHelpers';
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

  const openMaps = () => {
    if (!job) return;
    void Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`,
    );
  };

  const advance = () => {
    if (!job) return;
    const next = nextStatus(job.job_status);
    if (next) void advanceStatus(jobId, next);
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

          <SectionCard title={t('jobs.customerSection')}>
            <DetailRow
              icon="user"
              label={t('jobs.customer')}
              value={job.customer_name}
            />
            <DetailRow
              icon="phone"
              label={t('jobs.phone')}
              value={job.customer_phone_masked}
              onPress={() => setContactSheetVisible(true)}
            />
            <DetailRow
              icon="map-marker-alt"
              label={t('jobs.location')}
              value={address}
            />
            <DetailRow
              icon="building"
              label={t('jobs.branch')}
              value={job.branch_name}
              last
            />
          </SectionCard>

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
              icon="directions"
              label={t('jobs.navigate')}
              onPress={openMaps}
              accent
            />
            <ActionTile
              icon="map"
              label={t('jobs.mapPreview')}
              onPress={() => navigation.navigate('JobMap', { jobId })}
            />
            <ActionTile
              icon="shield-alt"
              label={t('verify.otp')}
              onPress={() => navigation.navigate('HandoverVerify', { jobId })}
            />
            {job.job_type === 'chauffeur' ? (
              <ActionTile
                icon="route"
                label={t('chauffeur.startTrip')}
                onPress={() => navigation.navigate('ChauffeurTrip', { jobId })}
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
                label={t('jobs.accept')}
                onPress={() => void acceptJob(jobId)}
                style={styles.ctaFlex}
              />
              <PrimaryButton
                label={t('jobs.reject')}
                variant="danger"
                onPress={() => setRejectModalVisible(true)}
                style={styles.ctaFlex}
              />
            </View>
          ) : job.job_status !== 'completed' && job.job_status !== 'rejected' ? (
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
