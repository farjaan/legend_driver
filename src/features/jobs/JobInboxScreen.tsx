import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ScreenScaffold,
  JobCard,
  EmptyState,
} from '@components';
import { FilterChipRow } from '@components/ui/FilterChipRow';
import { useJobStore } from '@store/jobStore';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { JobStatus } from '@domain/job.types';
import { useRootNavigation } from '@hooks/useRootNavigation';

type TabFilter = 'pending' | 'active' | 'completed' | 'cancelled';

const PENDING: JobStatus[] = ['assigned'];
const ACTIVE: JobStatus[] = ['accepted', 'en_route', 'arrived', 'handover_in_progress'];
const COMPLETED: JobStatus[] = ['completed'];
const CANCELLED: JobStatus[] = ['cancelled', 'rejected'];

function matchesTab(status: JobStatus, tab: TabFilter): boolean {
  if (tab === 'pending') return PENDING.includes(status);
  if (tab === 'active') return ACTIVE.includes(status);
  if (tab === 'completed') return COMPLETED.includes(status);
  return CANCELLED.includes(status);
}

export function JobInboxScreen() {
  const navigation = useRootNavigation();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const jobs = useJobStore(s => s.jobs);
  const isLoading = useJobStore(s => s.isLoading);
  const error = useJobStore(s => s.error);
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const [filter, setFilter] = useState<TabFilter>('pending');

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const filtered = useMemo(
    () => jobs.filter(j => matchesTab(j.job_status, filter)),
    [jobs, filter],
  );

  const filters = useMemo(
    () => [
      { key: 'pending', label: t('jobs.tabPending') },
      { key: 'active', label: t('jobs.tabActive') },
      { key: 'completed', label: t('jobs.tabCompleted') },
      { key: 'cancelled', label: t('jobs.tabCancelled') },
    ],
    [t],
  );

  const jobCount = filtered.length;

  return (
    <ScreenScaffold
      title={t('jobs.inbox')}
      subtitle={t('jobs.inboxSub')}
      bottomInset={tabBarInset}
      loading={isLoading}
      compact
      fill={!isLoading && filtered.length === 0}>
      <FilterChipRow chips={filters} selected={filter} onSelect={k => setFilter(k as TabFilter)} />

      {!isLoading && jobCount > 0 ? (
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {t('jobs.count', { count: jobCount })}
        </Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title={t('jobs.emptyTitle')}
          subtitle={t('jobs.emptySub')}
          icon="clipboard-list"
        />
      ) : (
        filtered.map(job => (
          <JobCard
            key={job.job_id}
            job={job}
            onPress={() => navigation.navigate('JobDetail', { jobId: job.job_id })}
          />
        ))
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  count: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.sm,
    marginTop: 0,
  },
  error: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: Colors.danger,
    marginBottom: 8,
  },
});
