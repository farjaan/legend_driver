import React, { useMemo } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { DriverTabBar, type DriverTabKey } from '@components/DriverTabBar';
import { useTranslation } from 'react-i18next';

type TabRouteName = 'HomeTab' | 'JobsTab' | 'ChatTab' | 'ProfileTab';

const ROUTE_TO_TAB: Record<TabRouteName, DriverTabKey> = {
  HomeTab: 'home',
  JobsTab: 'jobs',
  ChatTab: 'chat',
  ProfileTab: 'profile',
};

export function DriverCustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();

  const activeRoute = state.routes[state.index]?.name as TabRouteName | undefined;
  const activeTab =
    activeRoute && activeRoute in ROUTE_TO_TAB ? ROUTE_TO_TAB[activeRoute] : null;

  const tabs = useMemo(
    () => [
      { key: 'home' as const, label: t('tabs.home'), icon: 'home' },
      { key: 'jobs' as const, label: t('tabs.jobs'), icon: 'clipboard-list' },
      { key: 'chat' as const, label: t('tabs.chat'), icon: 'comment-dots' },
      { key: 'profile' as const, label: t('tabs.profile'), icon: 'user' },
    ],
    [t],
  );

  const onPress = (key: DriverTabKey) => {
    const routeName = (Object.keys(ROUTE_TO_TAB) as TabRouteName[]).find(
      r => ROUTE_TO_TAB[r] === key,
    );
    if (!routeName) return;
    const idx = state.routes.findIndex(r => r.name === routeName);
    if (idx < 0) return;
    const route = state.routes[idx];
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (state.index !== idx && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return <DriverTabBar activeTab={activeTab} tabs={tabs} onPress={onPress} />;
}
