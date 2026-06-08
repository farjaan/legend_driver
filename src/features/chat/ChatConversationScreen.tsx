import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { chatService } from '@api/services/chatService';
import { ScreenHeader } from '@components/ScreenHeader';
import { AppIcon } from '@components/icons';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { ChatStackParamList } from '@navigation/types';
import type { ChatMessage } from '@domain/chat.types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatConversation'>;

const SUPPORT_MESSAGES: ChatMessage[] = [
  {
    id: 's1',
    sender: 'dispatch',
    text: 'Hi — how can we help you today?',
    sent_at: '2026-05-25T16:10:00+04:00',
  },
  {
    id: 's2',
    sender: 'driver',
    text: 'I need roadside assistance near Sheikh Zayed Road.',
    sent_at: '2026-05-25T16:12:00+04:00',
  },
  {
    id: 's3',
    sender: 'dispatch',
    text: 'Your roadside assistance ticket has been assigned.',
    sent_at: '2026-05-25T16:20:00+04:00',
  },
];

const FLEET_MESSAGES: ChatMessage[] = [
  {
    id: 'f1',
    sender: 'dispatch',
    text: 'Reminder: VEH-204 registration expires next week.',
    sent_at: '2026-05-24T09:00:00+04:00',
  },
  {
    id: 'f2',
    sender: 'driver',
    text: 'I will upload the new registration tonight.',
    sent_at: '2026-05-24T09:08:00+04:00',
  },
  {
    id: 'f3',
    sender: 'dispatch',
    text: 'Please upload updated registration for VEH-204.',
    sent_at: '2026-05-24T09:15:00+04:00',
  },
];

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatConversationScreen({ navigation, route }: Props) {
  const { threadId, title, subtitle } = route.params;
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tabBarInset = useTabBarInset();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (threadId === 'dispatch') {
        return chatService.fetchDispatchMessages();
      }
      if (threadId === 'support') return SUPPORT_MESSAGES;
      if (threadId === 'fleet') return FLEET_MESSAGES;
      return [];
    };

    void load().then(data => {
      setMessages(data);
      setIsLoading(false);
    });
  }, [threadId]);

  const send = () => {
    if (!text.trim()) return;
    const next: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'driver',
      text: text.trim(),
      sent_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, next]);
    setText('');
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={BrandColors.accentOrange} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        ref={listRef}
        style={styles.list}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarInset + 72 },
        ]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isDriver = item.sender === 'driver';
          return (
            <View
              style={[
                styles.messageRow,
                isDriver ? styles.messageRowDriver : styles.messageRowDispatch,
              ]}>
              {!isDriver ? (
                <View style={styles.dispatchAvatar}>
                  <AppIcon name="headset" size={12} color={BrandColors.accentOrange} solid />
                </View>
              ) : null}
              <View
                style={[
                  styles.bubble,
                  isDriver ? styles.driverBubble : styles.dispatchBubble,
                ]}>
                <Text
                  style={[
                    styles.bubbleText,
                    isDriver && styles.driverBubbleText,
                  ]}>
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.bubbleTime,
                    isDriver && styles.driverBubbleTime,
                  ]}>
                  {formatMessageTime(item.sent_at)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.composer, { marginBottom: tabBarInset }]}>
        <TextInput
          placeholder={t('chat.placeholder')}
          placeholderTextColor={theme.textMuted}
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!text.trim()}
          activeOpacity={0.85}>
          <AppIcon name="paper-plane" size={16} color={Colors.white} solid />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.screenBackground },
    loading: {
      flex: 1,
      backgroundColor: theme.screenBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: { flex: 1 },
    listContent: {
      paddingTop: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: Spacing.sm,
      gap: Spacing.xs,
    },
    messageRowDriver: {
      justifyContent: 'flex-end',
    },
    messageRowDispatch: {
      justifyContent: 'flex-start',
    },
    dispatchAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    bubble: {
      maxWidth: '78%',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    bubbleText: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
    bubbleTime: {
      fontFamily: APP_FONTS.regular,
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    driverBubble: {
      backgroundColor: BrandColors.brandDeep,
      borderBottomRightRadius: 4,
    },
    dispatchBubble: {
      backgroundColor: theme.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    driverBubbleText: { color: '#fff' },
    driverBubbleTime: { color: 'rgba(255,255,255,0.72)' },
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.cardBorder,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      borderRadius: 14,
      paddingHorizontal: Spacing.md,
      paddingVertical: 10,
      backgroundColor: theme.screenBackground,
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.text,
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: BrandColors.accentOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnDisabled: {
      opacity: 0.45,
    },
  });
}
