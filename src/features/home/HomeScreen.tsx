import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { useTranslation } from 'react-i18next';
import { profileService } from '@api/services/profileService';
import type { WeeklySummary } from '@api/models/profile.models';
import { BrandColors } from '@constants/colors';
import { useAppTheme } from '@theme/useAppTheme';
import { useAuthStore } from '@store/authStore';
import { useShiftStore } from '@store/shiftStore';
import { createHomeStyles } from '@features/home/styles/homeStyles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createHomeStyles(theme), [theme]);
  const profile = useAuthStore(s => s.profile);
  const isOnline = useShiftStore(s => s.isOnline);
  const isSharingLocation = useShiftStore(s => s.isSharingLocation);
  const setOnline = useShiftStore(s => s.setOnline);
  const startShift = useShiftStore(s => s.startShift);
  const endShift = useShiftStore(s => s.endShift);
  const toggleLocationShare = useShiftStore(s => s.toggleLocationShare);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);

  const tabBarInset = useTabBarInset();
  const firstName = profile?.full_name?.split(' ')[0] ?? t('home.driverFallback');

  useEffect(() => {
    void profileService.fetchWeeklySummary().then(setSummary);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarInset }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting')}</Text>
          <Text style={styles.driverName}>{firstName}</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>{t('home.shiftStatus')}</Text>
              <Text style={styles.heroStatus}>
                {isOnline ? t('home.online') : t('home.offline')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.onlinePill, isOnline && styles.onlinePillActive]}
              onPress={() => setOnline(!isOnline)}
              activeOpacity={0.85}>
              <Text style={styles.onlinePillText}>
                {isOnline ? t('home.goOffline') : t('home.goOnline')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shiftBtn} onPress={startShift} activeOpacity={0.88}>
            <Text style={styles.shiftBtnText}>{t('home.startShift')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shiftBtn, styles.shiftBtnOutline]}
            onPress={endShift}
            activeOpacity={0.88}>
            <Text style={[styles.shiftBtnText, styles.shiftBtnTextOutline]}>
              {t('home.endShift')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <AppIcon name="clipboard-check" size={20} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>{summary?.jobs_completed ?? '—'}</Text>
            <Text style={styles.statLabel}>{t('home.jobsCompleted')}</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="clock" size={20} color={BrandColors.accentOrange} solid />
            <Text style={styles.statValue}>
              {summary ? `${summary.on_time_pct}%` : '—'}
            </Text>
            <Text style={styles.statLabel}>{t('home.onTime')}</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="star" size={20} color={BrandColors.accentOrange} />
            <Text style={styles.statValue}>{summary?.avg_rating ?? '—'}</Text>
            <Text style={styles.statLabel}>{t('home.avgRating')}</Text>
          </View>
        </View>


        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.85}>
          <View style={styles.actionIcon}>
            <AppIcon name="bell" size={22} color={BrandColors.accentOrange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('profile.notifications')}</Text>
            <Text style={styles.actionSub}>{t('home.notificationsSub')}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('BreakdownList')}
          activeOpacity={0.85}>
          <View style={styles.actionIcon}>
            <AppIcon name="tools" size={22} color={BrandColors.accentOrange} solid />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('profile.breakdown')}</Text>
            <Text style={styles.actionSub}>{t('home.breakdownSub')}</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('home.location')}</Text>
        <View style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <AppIcon name="crosshairs" size={22} color={BrandColors.accentOrange} solid />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('home.sharingLocation')}</Text>
            <Text style={styles.actionSub}>
              {isSharingLocation ? t('home.locationOn') : t('home.locationOff')}
            </Text>
          </View>
          <Switch
            value={isSharingLocation}
            onValueChange={toggleLocationShare}
            disabled={!isOnline}
            trackColor={{
              false: '#D1D5DB',
              true: BrandColors.accentOrange,
            }}
            thumbColor="#fff"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
