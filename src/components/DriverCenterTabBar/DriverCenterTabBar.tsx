import React, { useMemo } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { useAppTheme } from '@theme/useAppTheme';
import { useLanguage } from '@hooks/useLanguage';
import {
  createDriverCenterTabBarStyles,
  getDriverTabBarColors,
} from './DriverCenterTabBar.styles';

export type DriverTabKey = 'home' | 'vehicles' | 'chat' | 'jobs' | 'profile';

export type DriverCenterTabBarProps = {
  activeTab: DriverTabKey | null;
  translateY?: Animated.Value;
  homeLabel: string;
  vehiclesLabel: string;
  chatLabel: string;
  jobsLabel: string;
  profileLabel: string;
  onHomePress: () => void;
  onVehiclesPress: () => void;
  onChatPress: () => void;
  onJobsPress: () => void;
  onProfilePress: () => void;
};

export function DriverCenterTabBar({
  activeTab,
  translateY,
  homeLabel,
  vehiclesLabel,
  chatLabel,
  jobsLabel,
  profileLabel,
  onHomePress,
  onVehiclesPress,
  onChatPress,
  onJobsPress,
  onProfilePress,
}: DriverCenterTabBarProps) {
  const { theme } = useAppTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createDriverCenterTabBarStyles(theme), [theme]);
  const colors = useMemo(() => getDriverTabBarColors(theme), [theme]);

  const renderTab = (
    key: Exclude<DriverTabKey, 'jobs'>,
    label: string,
    iconName: string,
    onPress: () => void,
  ) => {
    const focused = activeTab === key;
    const color = focused ? colors.active : colors.inactive;

    return (
      <TouchableOpacity
        key={key}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        onPress={onPress}
        style={styles.tabButton}
        activeOpacity={0.75}>
        <AppIcon name={iconName} solid={focused} size={18} color={color} />
        <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const jobsFocused = activeTab === 'jobs';
  const leftTabs = (
    <>
      {renderTab('home', homeLabel, 'home', onHomePress)}
      {renderTab('vehicles', vehiclesLabel, 'car', onVehiclesPress)}
    </>
  );
  const rightTabs = (
    <>
      {renderTab('chat', chatLabel, 'comment-dots', onChatPress)}
      {renderTab('profile', profileLabel, 'user', onProfilePress)}
    </>
  );

  const containerStyle = translateY
    ? [styles.tabBarContainer, { transform: [{ translateY }] }]
    : styles.tabBarContainer;

  return (
    <Animated.View style={containerStyle}>
      <SafeAreaView edges={['bottom']} style={styles.safeAreaContainer}>
        <View style={[styles.tabBarContent, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.sideCluster, isRTL && styles.sideClusterRtl]}>
            {isRTL ? rightTabs : leftTabs}
          </View>

          <View style={styles.fabSlot}>
            <View style={styles.fabOuter}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={jobsFocused ? { selected: true } : {}}
                accessibilityLabel={jobsLabel}
                onPress={onJobsPress}
                style={[styles.fabButton, jobsFocused && styles.fabButtonActive]}
                activeOpacity={0.9}>
                <AppIcon name="clipboard-list" size={22} color="#FFFFFF" solid />
              </TouchableOpacity>
            </View>
            <Text style={[styles.fabLabel, jobsFocused && styles.fabLabelActive]}>
              {jobsLabel}
            </Text>
          </View>

          <View style={[styles.sideCluster, isRTL && styles.sideClusterRtl]}>
            {isRTL ? leftTabs : rightTabs}
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
