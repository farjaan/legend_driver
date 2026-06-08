import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { NetworkImage } from '@components/NetworkImage';
import { StatusPill } from '@components/ui/StatusPill';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { useTranslation } from 'react-i18next';
import { profileService } from '@api/services/profileService';
import { earningsService } from '@api/services/earningsService';
import type { WeeklySummary } from '@api/models/profile.models';
import { BrandColors } from '@constants/colors';
import { PlaceholderImages } from '@assets/placeholders';
import { useAppTheme } from '@theme/useAppTheme';
import { useAuthStore } from '@store/authStore';
import { useShiftStore } from '@store/shiftStore';
import { useJobStore } from '@store/jobStore';
import { useRootNavigation } from '@hooks/useRootNavigation';
import { createHomeStyles } from '@features/home/styles/homeStyles';
import { jobTypeLabel } from '@utils/jobHelpers';
import { isChauffeurJob, navigateChauffeurFlow } from '@utils/chauffeurHelpers';
import { formatJobSchedule } from '@utils/format';
import type { DriverJob, JobStatus } from '@domain/job.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const ACTIVE_STATUSES: JobStatus[] = [
  'accepted',
  'en_route',
  'arrived',
  'handover_in_progress',
];

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function HomeScreen({ navigation }: Props) {
  const rootNav = useRootNavigation();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createHomeStyles(theme), [theme]);
  const profile = useAuthStore(s => s.profile);
  const isOnline = useShiftStore(s => s.isOnline);
  const isSharingLocation = useShiftStore(s => s.isSharingLocation);
  const setOnline = useShiftStore(s => s.setOnline);
  const startShift = useShiftStore(s => s.startShift);
  const endShift = useShiftStore(s => s.endShift);
  const toggleLocationShare = useShiftStore(s => s.toggleLocationShare);
  const jobs = useJobStore(s => s.jobs);
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  const tabBarInset = useTabBarInset();
  const firstName = profile?.full_name?.split(' ')[0] ?? t('home.driverFallback');

  useEffect(() => {
    void profileService.fetchWeeklySummary().then(setSummary);
    void earningsService.fetchEarnings().then(d => setMonthlyEarnings(d.summary.month.amount_aed));
    void fetchJobs();
  }, [fetchJobs]);

  const stats = useMemo(() => {
    const todayJobs = jobs.filter(j => isToday(j.scheduled_at) && j.job_status !== 'rejected').length;
    const activeJobs = jobs.filter(j => ACTIVE_STATUSES.includes(j.job_status)).length;
    const completedJobs = jobs.filter(j => j.job_status === 'completed').length;
    return { todayJobs, activeJobs, completedJobs };
  }, [jobs]);

  const currentAssignment: DriverJob | undefined = useMemo(() => {
    const active = jobs.filter(j => ACTIVE_STATUSES.includes(j.job_status));
    if (active.length > 0) return active[0];
    return jobs.find(j => j.job_status === 'assigned');
  }, [jobs]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarInset }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text style={styles.greeting}>{t('home.greeting')}</Text>
            <Text style={styles.driverName}>{firstName}</Text>
          </View>
          <NetworkImage
            uri={profile?.avatar_uri}
            localSource={profile?.avatar_source ?? PlaceholderImages.driverAvatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>{t('home.shiftStatus')}</Text>
              <Text style={styles.heroStatus}>
                {isOnline ? t('home.online') : t('home.offline')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.onlinePill, isOnline && styles.onlinePillActive]}
              onPress={() => setOnline(!isOnline)}
              activeOpacity={0.85}>
              <Text style={styles.onlinePillText}>
                {isOnline ? t('home.goOffline') : t('home.goOnline')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shiftBtn} onPress={startShift} activeOpacity={0.88}>
            <Text style={styles.shiftBtnText}>{t('home.startShift')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shiftBtn, styles.shiftBtnOutline]}
            onPress={endShift}
            activeOpacity={0.88}>
            <Text style={[styles.shiftBtnText, styles.shiftBtnTextOutline]}>
              {t('home.endShift')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <AppIcon name="calendar-day" size={18} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>{stats.todayJobs}</Text>
            <Text style={styles.statLabel}>{t('home.todayJobs')}</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="bolt" size={18} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>{stats.activeJobs}</Text>
            <Text style={styles.statLabel}>{t('home.activeJobs')}</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="clipboard-check" size={18} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>{stats.completedJobs}</Text>
            <Text style={styles.statLabel}>{t('home.completedJobs')}</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="wallet" size={18} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>{monthlyEarnings}</Text>
            <Text style={styles.statLabel}>{t('home.monthlyEarnings')}</Text>
          </View>
        </View>

        {currentAssignment ? (
          <>
            <Text style={styles.sectionTitle}>{t('home.currentAssignment')}</Text>
            <View style={[styles.assignmentCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <View style={styles.assignmentTop}>
                <Text style={[styles.assignmentRef, { color: theme.text }]}>
                  {currentAssignment.booking_reference}
                </Text>
                <StatusPill label={jobTypeLabel(currentAssignment.job_type)} tone="active" />
              </View>
              <Text style={[styles.assignmentCustomer, { color: theme.textSecondary }]}>
                {currentAssignment.customer_name}
              </Text>
              <Text style={[styles.assignmentVehicle, { color: theme.textMuted }]}>
                {currentAssignment.vehicle.make} {currentAssignment.vehicle.model} ·{' '}
                {currentAssignment.vehicle.plate_number}
              </Text>
              <Text style={styles.assignmentTime}>
                {formatJobSchedule(currentAssignment.scheduled_at)}
              </Text>
              <View style={styles.assignmentActions}>
                <PrimaryButton
                  label={t('home.viewDetail')}
                  onPress={() => {
                    if (isChauffeurJob(currentAssignment) && currentAssignment.job_status !== 'assigned') {
                      navigateChauffeurFlow(rootNav, currentAssignment);
                    } else {
                      rootNav.navigate('JobDetail', { jobId: currentAssignment.job_id });
                    }
                  }}
                  style={styles.assignmentBtn}
                />
                <TouchableOpacity
                  style={[styles.upcomingBtn, { borderColor: theme.cardBorder }]}
                  onPress={() => navigation.getParent()?.navigate('JobsTab')}
                  activeOpacity={0.85}>
                  <Text style={[styles.upcomingBtnText, { color: theme.text }]}>
                    {t('home.upcomingJobs')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <AppIcon name="star" size={18} color={BrandColors.accentOrange} />
            <Text style={styles.statValue}>{summary?.avg_rating ?? '—'}</Text>
            <Text style={styles.statLabel}>{t('home.avgRating')}</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="clock" size={18} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>
              {summary ? `${summary.on_time_pct}%` : '—'}
            </Text>
            <Text style={styles.statLabel}>{t('home.onTime')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Earnings')}
          activeOpacity={0.85}>
          <View style={styles.actionIcon}>
            <AppIcon name="wallet" size={22} color={BrandColors.accentOrange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('earnings.title')}</Text>
            <Text style={styles.actionSub}>{t('home.earningsSub')}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('SupportTicketList')}
          activeOpacity={0.85}>
          <View style={styles.actionIcon}>
            <AppIcon name="headset" size={22} color={BrandColors.accentOrange} solid />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('support.title')}</Text>
            <Text style={styles.actionSub}>{t('home.supportSub')}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.85}>
          <View style={styles.actionIcon}>
            <AppIcon name="bell" size={22} color={BrandColors.accentOrange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('profile.notifications')}</Text>
            <Text style={styles.actionSub}>{t('home.notificationsSub')}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('BreakdownList')}
          activeOpacity={0.85}>
          <View style={styles.actionIcon}>
            <AppIcon name="tools" size={22} color={BrandColors.accentOrange} solid />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('profile.breakdown')}</Text>
            <Text style={styles.actionSub}>{t('home.breakdownSub')}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('home.location')}</Text>
        <View style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <AppIcon name="crosshairs" size={22} color={BrandColors.accentOrange} solid />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('home.sharingLocation')}</Text>
            <Text style={styles.actionSub}>
              {isSharingLocation ? t('home.locationOn') : t('home.locationOff')}
            </Text>
          </View>
          <Switch
            value={isSharingLocation}
            onValueChange={toggleLocationShare}
            disabled={!isOnline}
            trackColor={{
              false: '#D1D5DB',
              true: BrandColors.accentOrange,
            }}
            thumbColor="#fff"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
