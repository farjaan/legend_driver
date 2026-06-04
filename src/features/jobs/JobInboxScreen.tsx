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
import { useAppTheme } from '@theme/useAppTheme';
import type { JobType } from '@domain/job.types';
import { useRootNavigation } from '@hooks/useRootNavigation';

type Filter = 'all' | JobType;

export function JobInboxScreen() {
  const navigation = useRootNavigation();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const jobs = useJobStore(s => s.jobs);
  const isLoading = useJobStore(s => s.isLoading);
  const error = useJobStore(s => s.error);
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const filtered = useMemo(() => {
    if (filter === 'all') return jobs.filter(j => j.job_status !== 'rejected');
    return jobs.filter(j => j.job_type === filter && j.job_status !== 'rejected');
  }, [jobs, filter]);

  const filters = useMemo(
    () => [
      { key: 'all', label: t('jobs.all') },
      { key: 'delivery', label: t('jobs.filterDelivery') },
      { key: 'pickup', label: t('jobs.filterPickup') },
      { key: 'return_collection', label: t('jobs.filterReturn') },
      { key: 'chauffeur', label: t('jobs.filterChauffeur') },
    ],
    [t],
  );

  const jobCount = filtered.length;

  return (
    <ScreenScaffold
      title={t('jobs.inbox')}
      subtitle={t('jobs.inboxSub')}
      bottomInset={tabBarInset}
      loading={isLoading}>
      <FilterChipRow chips={filters} selected={filter} onSelect={k => setFilter(k as Filter)} />

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
    marginBottom: 8,
    marginTop: -4,
  },
  error: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: Colors.danger,
    marginBottom: 8,
  },
});
