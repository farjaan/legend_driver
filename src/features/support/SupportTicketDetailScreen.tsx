import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { StatusPill } from '@components/ui/StatusPill';
import { supportService } from '@api/services/supportService';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { formatJobSchedule } from '@utils/format';
import type { SupportTicket, SupportTicketStatus } from '@domain/support.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SupportStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<SupportStackParamList, 'SupportTicketDetail'>;

function statusTone(status: SupportTicketStatus): 'active' | 'success' | 'neutral' {
  if (status === 'open') return 'active';
  if (status === 'closed') return 'success';
  return 'neutral';
}

export function SupportTicketDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTicket = useCallback(() => {
    void supportService.fetchTickets().then(tickets => {
      setTicket(tickets.find(tk => tk.ticket_id === ticketId) ?? null);
      setLoading(false);
    });
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const sendReply = async () => {
    if (!reply.trim() || !ticket) return;
    setSending(true);
    try {
      await supportService.replyToTicket(ticketId, reply.trim());
      setReply('');
      loadTicket();
    } finally {
      setSending(false);
    }
  };

  if (!loading && !ticket) {
    return (
      <ScreenScaffold title={t('support.detailTitle')} onBack={() => navigation.goBack()}>
        <Text style={{ color: theme.textSecondary }}>{t('support.notFound')}</Text>
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold
      title={ticket?.ticket_number ?? t('support.detailTitle')}
      subtitle={ticket?.subject}
      onBack={() => navigation.goBack()}
      loading={loading}
      scroll={false}>
      {ticket ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}>
          <View style={styles.flex}>
            <SectionCard title={t('support.ticketInfo')}>
              <View style={styles.infoRow}>
                <StatusPill
                  label={t(`support.status.${ticket.status}`)}
                  tone={statusTone(ticket.status)}
                />
                <StatusPill
                  label={t(`support.priority.${ticket.priority}`)}
                  tone={ticket.priority === 'high' ? 'warning' : 'neutral'}
                />
              </View>
              <Text style={[styles.infoMeta, { color: theme.textSecondary }]}>
                {t(`support.category.${ticket.category}`)} · {formatJobSchedule(ticket.created_at)}
              </Text>
            </SectionCard>

            <Text style={[styles.convTitle, { color: theme.text }]}>{t('support.conversation')}</Text>

            <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
              {ticket.messages.map(msg => {
                const isDriver = msg.sender === 'driver';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.bubble,
                      isDriver ? styles.bubbleDriver : styles.bubbleAdmin,
                      {
                        backgroundColor: isDriver
                          ? BrandColors.brandDeep
                          : theme.elevatedSurface,
                        alignSelf: isDriver ? 'flex-end' : 'flex-start',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.bubbleSender,
                        { color: isDriver ? 'rgba(255,255,255,0.7)' : theme.textMuted },
                      ]}>
                      {isDriver ? t('support.you') : t('support.admin')}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleBody,
                        { color: isDriver ? '#fff' : theme.text },
                      ]}>
                      {msg.body}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        { color: isDriver ? 'rgba(255,255,255,0.55)' : theme.textMuted },
                      ]}>
                      {formatJobSchedule(msg.sent_at)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {ticket.status !== 'closed' ? (
              <View style={[styles.replyBar, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <TextInput
                  style={[styles.replyInput, { color: theme.text }]}
                  value={reply}
                  onChangeText={setReply}
                  placeholder={t('support.replyPlaceholder')}
                  placeholderTextColor={theme.textMuted}
                  multiline
                />
                <Pressable
                  onPress={sendReply}
                  disabled={!reply.trim() || sending}
                  style={[styles.sendBtn, { opacity: reply.trim() ? 1 : 0.4 }]}>
                  <AppIcon name="paper-plane" size={18} color="#fff" solid />
                </Pressable>
              </View>
            ) : (
              <Text style={[styles.closedNote, { color: theme.textMuted }]}>
                {t('support.closedNote')}
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoMeta: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
  },
  convTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  messages: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  messagesContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bubbleDriver: {},
  bubbleAdmin: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  bubbleSender: {
    fontFamily: APP_FONTS.bold,
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bubbleBody: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTime: {
    fontFamily: APP_FONTS.regular,
    fontSize: 10,
    marginTop: 4,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  replyInput: {
    flex: 1,
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
    maxHeight: 80,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BrandColors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedNote: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    textAlign: 'center',
    padding: Spacing.md,
  },
});
