import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { EmptyState } from '@components/EmptyState';
import { useCardStyles } from '@hooks/useCardStyles';
import { notificationService } from '@api/services/notificationService';
import { BrandColors } from '@constants/colors';
import type { DriverNotification } from '@domain/notification.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@navigation/types';
import type { ProfileStackParamList } from '@navigation/types';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'Notifications'>
  | NativeStackScreenProps<ProfileStackParamList, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const cardStyles = useCardStyles();
  const [items, setItems] = useState<DriverNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void notificationService.fetchNotifications().then(data => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  const canGoBack = navigation.canGoBack();

  return (
    <ScreenScaffold
      title={t('profile.notifications')}
      subtitle={t('notifications.sub')}
      onBack={canGoBack ? () => navigation.goBack() : undefined}
      loading={isLoading}>
      {items.length === 0 ? (
        <EmptyState
          title={t('notifications.emptyTitle')}
          subtitle={t('notifications.emptySub')}
          icon="bell"
        />
      ) : (
        items.map(n => (
          <Pressable
            key={n.id}
            style={({ pressed }) => [
              cardStyles.card,
              !n.read && styles.unread,
              pressed && cardStyles.cardPressed,
            ]}>
            <View style={cardStyles.row}>
              <View style={cardStyles.iconBox}>
                <AppIcon name="bell" size={16} color={BrandColors.accentOrange} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={cardStyles.title}>{n.title}</Text>
                <Text style={cardStyles.subtitle} numberOfLines={2}>
                  {n.body}
                </Text>
                <Text style={cardStyles.meta}>{n.created_at}</Text>
              </View>
            </View>
          </Pressable>
        ))
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.accentOrange,
  },
});
