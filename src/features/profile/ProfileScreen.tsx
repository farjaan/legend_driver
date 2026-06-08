import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NetworkImage } from '@components/NetworkImage';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { MenuSection } from '@components/profile/MenuSection';
import { StatusPill } from '@components/ui/StatusPill';
import { PlaceholderImages } from '@assets/placeholders';
import { useAuthStore } from '@store/authStore';
import { useTranslation } from 'react-i18next';
import { useTabBarInset } from '@hooks/useTabBarInset';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';
import { LogoutConfirmModal } from '@features/profile/components/LogoutConfirmModal';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen({ navigation }: Props) {
  const tabBarInset = useTabBarInset();
  const profile = useAuthStore(s => s.profile);
  const logout = useAuthStore(s => s.logout);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <ScreenScaffold title={t('profile.title')} bottomInset={tabBarInset + Spacing.md}>
      <Pressable
        style={[
          styles.profileCard,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
        ]}
        onPress={() => navigation.navigate('EditProfile')}
        android_ripple={{ color: 'rgba(44,27,71,0.06)' }}>
        <NetworkImage
          uri={profile?.avatar_uri}
          localSource={profile?.avatar_source ?? PlaceholderImages.driverAvatar}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {profile?.full_name ?? 'Driver'}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
            {profile?.email}
          </Text>
          <View style={styles.badges}>
            <StatusPill
              label={`★ ${profile?.rating_avg ?? '—'}`}
              tone="active"
            />
            <StatusPill
              label={t(`profile.kyc.${profile?.kyc_status ?? 'pending'}`)}
              tone={profile?.kyc_status === 'approved' ? 'success' : 'neutral'}
            />
          </View>
        </View>
        <AppIcon name="chevron-right" size={14} color="#C4C4C4" />
      </Pressable>

      <MenuSection
        title={t('profile.sectionAccount')}
        items={[
          {
            id: 'edit',
            label: t('profile.editProfile'),
            icon: 'user-edit',
            onPress: () => navigation.navigate('EditProfile'),
          },
          {
            id: 'documents',
            label: t('documents.title'),
            icon: 'folder-open',
            onPress: () => navigation.navigate('Documents'),
          },
          {
            id: 'vehicles',
            label: t('profile.myVehicles'),
            icon: 'car',
            value: String(profile?.fleet_vehicles?.length ?? 0),
            onPress: () => navigation.getParent()?.navigate('VehiclesTab'),
          },
        ]}
      />

      <MenuSection
        title={t('profile.sectionWork')}
        items={[
          {
            id: 'earnings',
            label: t('earnings.title'),
            icon: 'wallet',
            onPress: () => navigation.navigate('Earnings'),
          },
          {
            id: 'kyc',
            label: t('profile.kycWizard'),
            icon: 'id-card',
            value: t(`profile.kyc.${profile?.kyc_status ?? 'pending'}`),
            onPress: () => navigation.navigate('KycWizard'),
          },
          {
            id: 'ratings',
            label: t('profile.ratings'),
            icon: 'star',
            onPress: () => navigation.navigate('Ratings'),
          },
          {
            id: 'penalties',
            label: t('profile.penalties'),
            icon: 'exclamation-circle',
            onPress: () => navigation.navigate('Penalties'),
          },
          {
            id: 'notifications',
            label: t('profile.notifications'),
            icon: 'bell',
            onPress: () => navigation.navigate('Notifications'),
          },
        ]}
      />

      <MenuSection
        title={t('profile.sectionSupport')}
        items={[
          {
            id: 'support',
            label: t('support.title'),
            icon: 'headset',
            onPress: () => navigation.navigate('SupportTicketList'),
          },
          {
            id: 'breakdown',
            label: t('profile.breakdown'),
            icon: 'tools',
            onPress: () => navigation.navigate('BreakdownList'),
          },
          {
            id: 'incident',
            label: t('profile.incidentReport'),
            icon: 'file-alt',
            onPress: () => navigation.navigate('IncidentReport'),
          },
        ]}
      />

      <MenuSection
        title={t('profile.sectionApp')}
        items={[
          {
            id: 'compliance',
            label: t('profile.compliance'),
            icon: 'shield-alt',
            onPress: () => navigation.navigate('Compliance'),
          },
          {
            id: 'settings',
            label: t('profile.settings'),
            icon: 'cog',
            onPress: () => navigation.navigate('Settings'),
          },
        ]}
      />

      <Pressable style={styles.logoutBtn} onPress={() => setLogoutModalVisible(true)}>
        <AppIcon name="sign-out-alt" size={16} color={Colors.danger} />
        <Text style={styles.logoutTxt}>{t('profile.logout')}</Text>
      </Pressable>

      <LogoutConfirmModal
        visible={logoutModalVisible}
        driverName={profile?.full_name}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          void logout();
        }}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: Spacing.md,
  },
  profileInfo: { flex: 1, minWidth: 0 },
  name: {
    fontFamily: APP_FONTS.bold,
    fontSize: 17,
    lineHeight: 21,
  },
  meta: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
    backgroundColor: 'rgba(220, 38, 38, 0.06)',
    marginBottom: Spacing.lg,
  },
  logoutTxt: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    color: Colors.danger,
  },
});
