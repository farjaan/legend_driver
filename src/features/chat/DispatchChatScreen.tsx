import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { chatService } from '@api/services/chatService';
import { ScreenHeader } from '@components/ScreenHeader';
import { AppIcon } from '@components/icons';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { ChatMessage } from '@domain/chat.types';

export function DispatchChatScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tabBarInset = useTabBarInset();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void chatService.fetchDispatchMessages().then(data => {
      setMessages(data);
      setIsLoading(false);
    });
  }, []);

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'driver',
        text: text.trim(),
        sent_at: new Date().toISOString(),
      },
    ]);
    setText('');
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={BrandColors.accentOrange} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('chat.dispatch')} subtitle={t('chat.dispatchSub')} />
      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarInset + 56 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === 'driver' ? styles.driver : styles.dispatch,
            ]}>
            <Text
              style={[
                styles.bubbleText,
                item.sender === 'driver' && styles.driverText,
              ]}>
              {item.text}
            </Text>
          </View>
        )}
      />
      <View style={[styles.composer, { marginBottom: tabBarInset }]}>
        <TextInput
          placeholder={t('chat.placeholder')}
          placeholderTextColor={theme.textMuted}
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send} activeOpacity={0.85}>
          <AppIcon name="paper-plane" size={16} color={Colors.white} solid />
        </TouchableOpacity>
      </View>
    </View>
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
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.sm,
    },
    bubble: {
      maxWidth: '85%',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      marginBottom: Spacing.sm,
    },
    bubbleText: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.text,
      lineHeight: 19,
    },
    driver: {
      alignSelf: 'flex-end',
      backgroundColor: BrandColors.brandDeep,
      borderBottomRightRadius: 4,
    },
    dispatch: {
      alignSelf: 'flex-start',
      backgroundColor: theme.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    driverText: { color: '#fff' },
    composer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.cardBorder,
    },
    input: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      paddingHorizontal: Spacing.md,
      backgroundColor: theme.screenBackground,
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.text,
      marginRight: Spacing.sm,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: BrandColors.accentOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
