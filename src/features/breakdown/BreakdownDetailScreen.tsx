import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { StatusPill } from '@components/ui/StatusPill';
import { breakdownService } from '@api/services/breakdownService';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { BreakdownStatus, BreakdownTicket } from '@domain/breakdown.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, ProfileStackParamList } from '@navigation/types';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'BreakdownDetail'>
  | NativeStackScreenProps<ProfileStackParamList, 'BreakdownDetail'>;

const FLOW: BreakdownStatus[] = ['assigned', 'en_route', 'on_site', 'resolved'];

export function BreakdownDetailScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [ticket, setTicket] = useState<BreakdownTicket | null>(null);
  const [status, setStatus] = useState<BreakdownStatus>('assigned');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void breakdownService.fetchTickets().then(tickets => {
      const found = tickets.find(item => item.ticket_id === route.params.ticketId) ?? null;
      setTicket(found);
      if (found) setStatus(found.status);
      setIsLoading(false);
    });
  }, [route.params.ticketId]);

  const advance = () => {
    const idx = FLOW.indexOf(status);
    if (idx < FLOW.length - 1) setStatus(FLOW[idx + 1]);
  };

  if (!isLoading && !ticket) {
    return (
      <ScreenScaffold
        title={t('breakdown.detail')}
        onBack={() => navigation.goBack()}>
        <Text style={styles.notFound}>{t('breakdown.notFound')}</Text>
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold
      title={ticket?.ticket_id ?? t('breakdown.detail')}
      subtitle={ticket?.booking_reference}
      onBack={() => navigation.goBack()}
      loading={isLoading}>
      {ticket ? (
        <>
          <View style={styles.card}>
            <StatusPill label={t(`breakdown.status.${status}`)} tone="active" />
            <Text style={styles.issue}>{ticket.issue_summary}</Text>
            <Text style={styles.customer}>{ticket.customer_name}</Text>
            <View style={styles.row}>
              <AppIcon name="map-marker-alt" size={14} color={BrandColors.accentOrange} solid />
              <Text style={styles.address}>{ticket.address}</Text>
            </View>
          </View>

          <Text style={styles.stepsTitle}>{t('breakdown.progress')}</Text>
          <View style={styles.steps}>
            {FLOW.map((step, index) => {
              const done = FLOW.indexOf(status) >= index;
              return (
                <View key={step} style={styles.stepRow}>
                  <View style={[styles.dot, done && styles.dotDone]} />
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>
                    {t(`breakdown.status.${step}`)}
                  </Text>
                </View>
              );
            })}
          </View>

          {status !== 'resolved' ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={advance} activeOpacity={0.88}>
              <Text style={styles.primaryTxt}>{t('breakdown.updateStatus')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resolvedBanner}>
              <AppIcon name="check-circle" size={18} color={Colors.success} solid />
              <Text style={styles.resolvedTxt}>{t('breakdown.resolved')}</Text>
            </View>
          )}
        </>
      ) : null}
    </ScreenScaffold>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Layout.cardPadding,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: Spacing.md,
    },
    issue: {
      fontFamily: APP_FONTS.bold,
      fontSize: 16,
      color: theme.text,
      lineHeight: 22,
      marginTop: Spacing.sm,
    },
    customer: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 19,
      marginTop: 4,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: Spacing.sm,
    },
    address: {
      flex: 1,
      fontFamily: APP_FONTS.regular,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    stepsTitle: {
      fontFamily: APP_FONTS.bold,
      fontSize: 14,
      color: theme.text,
      marginBottom: Spacing.sm,
    },
    steps: {
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Layout.cardPadding,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: Spacing.lg,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 6,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primarySoft,
    },
    dotDone: {
      backgroundColor: BrandColors.accentOrange,
    },
    stepLabel: {
      fontFamily: APP_FONTS.regular,
      fontSize: 13,
      color: theme.textMuted,
      lineHeight: 18,
    },
    stepLabelDone: {
      fontFamily: APP_FONTS.bold,
      color: theme.text,
    },
    primaryBtn: {
      height: 48,
      borderRadius: 12,
      backgroundColor: BrandColors.accentOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryTxt: {
      fontFamily: APP_FONTS.bold,
      fontSize: 15,
      color: Colors.white,
    },
    resolvedBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: Spacing.md,
      borderRadius: 12,
      backgroundColor: 'rgba(22, 163, 74, 0.1)',
    },
    resolvedTxt: {
      fontFamily: APP_FONTS.bold,
      fontSize: 14,
      color: Colors.success,
    },
    notFound: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
}
