import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { chatService } from '@api/services/chatService';
import { AppIcon } from '@components/icons';
import { EmptyState } from '@components/EmptyState';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { ChatStackParamList } from '@navigation/types';
import type { ChatThread } from '@domain/chat.types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

function formatThreadTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function ChatListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tabBarInset = useTabBarInset();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadThreads = useCallback(() => {
    setIsLoading(true);
    void chatService.fetchThreads().then(data => {
      setThreads(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const totalUnread = useMemo(
    () => threads.reduce((sum, thread) => sum + thread.unread_count, 0),
    [threads],
  );

  const openThread = (thread: ChatThread) => {
    navigation.navigate('ChatConversation', {
      threadId: thread.id,
      title: thread.title,
      subtitle: thread.subtitle,
    });
  };

  return (
    <ScreenScaffold
      title={t('chat.inbox')}
      subtitle={
        totalUnread > 0
          ? t('chat.inboxSubUnread', { count: totalUnread })
          : t('chat.inboxSub')
      }
      bottomInset={tabBarInset}
      loading={isLoading}>
      {threads.length === 0 ? (
        <EmptyState
          title={t('chat.emptyTitle')}
          subtitle={t('chat.emptySub')}
          icon="comment-dots"
        />
      ) : (
        threads.map(thread => (
          <Pressable
            key={thread.id}
            onPress={() => openThread(thread)}
            style={({ pressed }) => [
              styles.threadCard,
              pressed && styles.threadCardPressed,
            ]}
            android_ripple={{ color: 'rgba(44,27,71,0.06)' }}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <AppIcon
                  name={thread.icon}
                  size={18}
                  color={BrandColors.accentOrange}
                  solid
                />
              </View>
              {thread.unread_count > 0 ? (
                <View style={styles.unreadDot} />
              ) : null}
            </View>

            <View style={styles.threadBody}>
              <View style={styles.threadTopRow}>
                <Text style={styles.threadTitle} numberOfLines={1}>
                  {thread.title}
                </Text>
                <Text style={styles.threadTime}>
                  {formatThreadTime(thread.last_message_at)}
                </Text>
              </View>
              <Text style={styles.threadSubtitle} numberOfLines={1}>
                {thread.subtitle}
              </Text>
              <View style={styles.threadBottomRow}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {thread.last_message}
                </Text>
                {thread.unread_count > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>
                      {thread.unread_count > 9 ? '9+' : thread.unread_count}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <AppIcon name="chevron-right" size={12} color={theme.textMuted} />
          </Pressable>
        ))
      )}
    </ScreenScaffold>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    threadCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      marginBottom: Spacing.sm,
      gap: Spacing.sm,
    },
    threadCardPressed: {
      opacity: 0.92,
    },
    avatarWrap: {
      position: 'relative',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.screenBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    unreadDot: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: BrandColors.accentOrange,
      borderWidth: 2,
      borderColor: theme.surface,
    },
    threadBody: {
      flex: 1,
      minWidth: 0,
    },
    threadTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    threadTitle: {
      flex: 1,
      fontFamily: APP_FONTS.bold,
      fontSize: 15,
      color: theme.text,
    },
    threadTime: {
      fontFamily: APP_FONTS.regular,
      fontSize: 11,
      color: theme.textMuted,
    },
    threadSubtitle: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    threadBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: Spacing.sm,
    },
    lastMessage: {
      flex: 1,
      fontFamily: APP_FONTS.regular,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 6,
      backgroundColor: BrandColors.accentOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadgeText: {
      fontFamily: APP_FONTS.bold,
      fontSize: 10,
      color: '#fff',
    },
  });
}
