import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { FormField } from '@components/ui/FormField';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { StatusPill } from '@components/ui/StatusPill';
import { NetworkImage } from '@components/NetworkImage';
import { PlaceholderImages } from '@assets/placeholders';
import { useAuthStore } from '@store/authStore';
import { profileService } from '@api/services/profileService';
import { usePhotoPicker } from '@hooks/usePhotoPicker';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const profile = useAuthStore(s => s.profile);
  const updateProfile = useAuthStore(s => s.updateProfile);

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { image: avatarImage, promptPick: promptChangePhoto } = usePhotoPicker({
    t,
    cameraType: 'front',
  });

  const displayAvatarUri = avatarImage?.uri ?? profile?.avatar_uri;

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await profileService.updateProfile({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        ...(avatarImage ? { avatar_uri: avatarImage.uri } : {}),
      });
      updateProfile(updated);
      setSaved(true);
      setTimeout(() => navigation.goBack(), 600);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenScaffold
      title={t('profile.editProfile')}
      subtitle={t('profile.editProfileSub')}
      onBack={() => navigation.goBack()}>
      <View style={styles.avatarRow}>
        <TouchableOpacity onPress={promptChangePhoto} activeOpacity={0.85}>
          <NetworkImage
            uri={displayAvatarUri}
            localSource={
              displayAvatarUri ? undefined : (profile?.avatar_source ?? PlaceholderImages.driverAvatar)
            }
            style={styles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={styles.avatarMeta}>
          <Text style={styles.employeeId}>{profile?.employee_id}</Text>
          <StatusPill
            label={t(`profile.kyc.${profile?.kyc_status ?? 'pending'}`)}
            tone={profile?.kyc_status === 'approved' ? 'success' : 'active'}
          />
        </View>
      </View>

      <FormField label={t('profile.fullName')} value={fullName} onChangeText={setFullName} />
      <FormField
        label={t('profile.email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        label={t('profile.phone')}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <FormField
        label={t('profile.licenseExpiry')}
        value={profile?.license_expiry ?? '—'}
        editable={false}
      />

      {saved ? <Text style={styles.saved}>{t('profile.saved')}</Text> : null}

      <PrimaryButton
        label={t('profile.save')}
        onPress={save}
        loading={saving}
        style={styles.saveBtn}
      />

      <TouchableOpacity style={styles.changePhoto} activeOpacity={0.8} onPress={promptChangePhoto}>
        <Text style={styles.changePhotoTxt}>{t('profile.changePhoto')}</Text>
      </TouchableOpacity>
    </ScreenScaffold>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: Spacing.md,
  },
  avatarMeta: { flex: 1, gap: Spacing.sm },
  employeeId: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    color: theme.text,
  },
  saved: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: BrandColors.accentOrange,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  saveBtn: { marginTop: Spacing.sm },
  changePhoto: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  changePhotoTxt: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
    color: BrandColors.accentOrange,
  },
  });
}
