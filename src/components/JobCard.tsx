import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NetworkImage } from '@components/NetworkImage';
import { StatusPill } from '@components/ui/StatusPill';
import { getVehicleImageProps } from '@utils/vehicleImage';
import { useTranslation } from 'react-i18next';
import { jobTypeLabel } from '@utils/jobHelpers';
import { formatJobSchedule } from '@utils/format';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { DriverJob } from '@domain/job.types';

type Props = {
  job: DriverJob;
  onPress: () => void;
};

export function JobCard({ job, onPress }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        <StatusPill
          label={t(`jobs.priority.${job.priority}`)}
          tone={job.priority === 'urgent' ? 'warning' : 'active'}
        />
        <StatusPill label={jobTypeLabel(job.job_type)} tone="neutral" />
        <View style={styles.flex} />
        <Text style={styles.status}>{t(`jobs.status.${job.job_status}`)}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.info}>
          <Text style={styles.ref} numberOfLines={1}>
            {job.booking_reference}
          </Text>
          <Text style={styles.customer} numberOfLines={1}>
            {job.customer_name}
          </Text>
          <Text style={styles.vehicle} numberOfLines={1}>
            {job.vehicle.make} {job.vehicle.model} · {job.vehicle.plate_number}
          </Text>
          <Text style={styles.schedule}>{formatJobSchedule(job.scheduled_at)}</Text>
        </View>
        <NetworkImage
          {...getVehicleImageProps(job.vehicle)}
          style={styles.thumb}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>['theme']) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Layout.cardPadding,
      marginBottom: Layout.listGap,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    pressed: { opacity: 0.94 },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    flex: { flex: 1 },
    status: {
      fontFamily: APP_FONTS.bold,
      fontSize: 11,
      color: BrandColors.accentOrange,
    },
    body: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.md,
    },
    info: { flex: 1, minWidth: 0 },
    ref: {
      fontFamily: APP_FONTS.bold,
      fontSize: 15,
      color: theme.text,
      lineHeight: 20,
    },
    customer: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 19,
      marginTop: 1,
    },
    vehicle: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textMuted,
      lineHeight: 16,
      marginTop: 2,
    },
    schedule: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: BrandColors.accentOrange,
      lineHeight: 16,
      marginTop: 4,
    },
    thumb: {
      width: 72,
      height: 72,
      borderRadius: 10,
    },
  });
}
