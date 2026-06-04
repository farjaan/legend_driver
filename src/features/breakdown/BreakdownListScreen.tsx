import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { EmptyState } from '@components/EmptyState';
import { StatusPill } from '@components/ui/StatusPill';
import { useCardStyles } from '@hooks/useCardStyles';
import { breakdownService } from '@api/services/breakdownService';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import type { BreakdownTicket, BreakdownStatus } from '@domain/breakdown.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, ProfileStackParamList } from '@navigation/types';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'BreakdownList'>
  | NativeStackScreenProps<ProfileStackParamList, 'BreakdownList'>;

function statusTone(status: BreakdownStatus): 'active' | 'success' | 'neutral' {
  if (status === 'resolved') return 'success';
  if (status === 'en_route' || status === 'on_site') return 'active';
  return 'neutral';
}

export function BreakdownListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const cardStyles = useCardStyles();
  const [tickets, setTickets] = useState<BreakdownTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void breakdownService.fetchTickets().then(data => {
      setTickets(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <ScreenScaffold
      title={t('profile.breakdown')}
      subtitle={t('breakdown.listSub')}
      onBack={() => navigation.goBack()}
      loading={isLoading}>
      {tickets.length === 0 ? (
        <EmptyState
          title={t('breakdown.emptyTitle')}
          subtitle={t('breakdown.emptySub')}
          icon="tools"
        />
      ) : (
        tickets.map(ticket => (
          <Pressable
            key={ticket.ticket_id}
            onPress={() =>
              (navigation as { navigate: (n: string, p?: object) => void }).navigate(
                'BreakdownDetail',
                { ticketId: ticket.ticket_id },
              )
            }
            style={({ pressed }) => [cardStyles.card, pressed && cardStyles.cardPressed]}>
            <View style={cardStyles.rowBetween}>
              <StatusPill
                label={t(`breakdown.status.${ticket.status}`)}
                tone={statusTone(ticket.status)}
              />
              <Text style={[cardStyles.meta, styles.ticketId]}>{ticket.ticket_id}</Text>
            </View>
            <Text style={cardStyles.title}>{ticket.issue_summary}</Text>
            <Text style={cardStyles.subtitle}>{ticket.customer_name}</Text>
            <View style={styles.addressRow}>
              <AppIcon name="map-marker-alt" size={12} color={BrandColors.accentOrange} solid />
              <Text style={cardStyles.meta} numberOfLines={2}>
                {ticket.address}
              </Text>
            </View>
            <Text style={[cardStyles.meta, styles.ref]}>{ticket.booking_reference}</Text>
          </Pressable>
        ))
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  ticketId: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
    lineHeight: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
  },
  ref: {
    marginTop: 6,
    color: BrandColors.accentOrange,
  },
});
