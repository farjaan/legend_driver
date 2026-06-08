import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { EmptyState } from '@components/EmptyState';
import { FilterChipRow } from '@components/ui/FilterChipRow';
import { StatusPill } from '@components/ui/StatusPill';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { supportService } from '@api/services/supportService';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { formatJobSchedule } from '@utils/format';
import type { SupportTicket, SupportTicketStatus } from '@domain/support.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SupportStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<SupportStackParamList, 'SupportTicketList'>;

type TabFilter = 'all' | SupportTicketStatus;

function statusTone(status: SupportTicketStatus): 'active' | 'success' | 'neutral' {
  if (status === 'open') return 'active';
  if (status === 'closed') return 'success';
  return 'neutral';
}

export function SupportTicketListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<TabFilter>('all');
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(() => {
    setLoading(true);
    void supportService.fetchTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTickets);
    return unsubscribe;
  }, [navigation, loadTickets]);

  const filtered = useMemo(() => {
    if (filter === 'all') return tickets;
    return tickets.filter(t => t.status === filter);
  }, [tickets, filter]);

  const chips = useMemo(
    () => [
      { key: 'all', label: t('support.tabAll') },
      { key: 'open', label: t('support.tabOpen') },
      { key: 'in_progress', label: t('support.tabInProgress') },
      { key: 'closed', label: t('support.tabClosed') },
    ],
    [t],
  );

  return (
    <ScreenScaffold
      title={t('support.title')}
      subtitle={t('support.listSub')}
      onBack={() => navigation.goBack()}
      loading={loading}
      compact
      fill={!loading && filtered.length === 0}>
      <FilterChipRow chips={chips} selected={filter} onSelect={k => setFilter(k as TabFilter)} />

      <PrimaryButton
        label={t('support.createTicket')}
        onPress={() => navigation.navigate('CreateSupportTicket')}
        style={styles.createBtn}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={t('support.emptyTitle')}
          subtitle={t('support.emptySub')}
          icon="headset"
        />
      ) : (
        filtered.map(ticket => (
          <Pressable
            key={ticket.ticket_id}
            onPress={() =>
              navigation.navigate('SupportTicketDetail', { ticketId: ticket.ticket_id })
            }
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.94 : 1,
              },
            ]}>
            <View style={styles.cardTop}>
              <StatusPill
                label={t(`support.status.${ticket.status}`)}
                tone={statusTone(ticket.status)}
              />
              <Text style={[styles.ticketNum, { color: theme.textMuted }]}>
                {ticket.ticket_number}
              </Text>
            </View>
            <Text style={[styles.subject, { color: theme.text }]} numberOfLines={2}>
              {ticket.subject}
            </Text>
            <View style={styles.cardBottom}>
              <View style={styles.categoryRow}>
                <AppIcon name="tag" size={12} color={BrandColors.accentOrange} />
                <Text style={[styles.meta, { color: theme.textSecondary }]}>
                  {t(`support.category.${ticket.category}`)}
                </Text>
              </View>
              <Text style={[styles.meta, { color: theme.textMuted }]}>
                {formatJobSchedule(ticket.created_at)}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  createBtn: { marginBottom: Spacing.sm },
  card: {
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ticketNum: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
  },
  subject: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
  },
});
