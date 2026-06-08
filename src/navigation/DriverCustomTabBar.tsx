import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  DriverCenterTabBar,
  type DriverTabKey,
} from '@components/DriverCenterTabBar';
import { useTranslation } from 'react-i18next';

type TabRouteName =
  | 'HomeTab'
  | 'VehiclesTab'
  | 'ChatTab'
  | 'JobsTab'
  | 'ProfileTab';

const ROUTE_TO_TAB: Record<TabRouteName, DriverTabKey> = {
  HomeTab: 'home',
  VehiclesTab: 'vehicles',
  ChatTab: 'chat',
  JobsTab: 'jobs',
  ProfileTab: 'profile',
};

const TAB_ROOT_SCREEN: Record<TabRouteName, string> = {
  HomeTab: 'HomeMain',
  VehiclesTab: 'MyVehicles',
  ChatTab: 'ChatList',
  JobsTab: 'JobInbox',
  ProfileTab: 'ProfileMain',
};

export function DriverCustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();

  const activeRoute = state.routes[state.index]?.name as TabRouteName | undefined;
  const activeTab =
    activeRoute && activeRoute in ROUTE_TO_TAB ? ROUTE_TO_TAB[activeRoute] : null;

  const navigateToTab = (key: DriverTabKey) => {
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
    if (event.defaultPrevented) return;

    navigation.navigate(routeName, { screen: TAB_ROOT_SCREEN[routeName] });
  };

  return (
    <DriverCenterTabBar
      activeTab={activeTab}
      homeLabel={t('tabs.home')}
      vehiclesLabel={t('tabs.vehicles')}
      chatLabel={t('tabs.chat')}
      jobsLabel={t('tabs.jobs')}
      profileLabel={t('tabs.profile')}
      onHomePress={() => navigateToTab('home')}
      onVehiclesPress={() => navigateToTab('vehicles')}
      onChatPress={() => navigateToTab('chat')}
      onJobsPress={() => navigateToTab('jobs')}
      onProfilePress={() => navigateToTab('profile')}
    />
  );
}
