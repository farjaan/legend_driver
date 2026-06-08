import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { StatusPill } from '@components/ui/StatusPill';
import { useAuthStore } from '@store/authStore';
import { usePhotoPicker } from '@hooks/usePhotoPicker';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { DriverDocumentStatus } from '@domain/driver.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Documents'>;

type DocKey = keyof DriverDocumentStatus;

const DOC_KEYS: DocKey[] = ['driving_license', 'national_id', 'employee_id', 'insurance'];

const DOC_ICONS: Record<DocKey, string> = {
  driving_license: 'id-card',
  national_id: 'passport',
  employee_id: 'badge',
  insurance: 'shield-alt',
};

function statusTone(status: string): 'success' | 'warning' | 'neutral' {
  if (status === 'uploaded') return 'success';
  if (status === 'expired') return 'warning';
  return 'neutral';
}

export function DocumentsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const profile = useAuthStore(s => s.profile);
  const updateProfile = useAuthStore(s => s.updateProfile);
  const [previews, setPreviews] = useState<Partial<Record<DocKey, string>>>({});
  const pendingKey = useRef<DocKey | null>(null);
  const { image, promptPick } = usePhotoPicker({ t });

  const docs = profile?.documents ?? {
    driving_license: 'pending',
    national_id: 'pending',
    employee_id: 'pending',
    insurance: 'pending',
  };

  const handleUpload = (key: DocKey) => {
    pendingKey.current = key;
    promptPick();
  };

  useEffect(() => {
    const key = pendingKey.current;
    if (!key || !image?.uri) return;
    const currentDocs = profile?.documents ?? docs;
    setPreviews(prev => ({ ...prev, [key]: image.uri }));
    updateProfile({ documents: { ...currentDocs, [key]: 'uploaded' } });
    Alert.alert(t('common.success'), t('documents.uploadSuccess'));
    pendingKey.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when new image captured
  }, [image]);

  return (
    <ScreenScaffold
      title={t('documents.title')}
      subtitle={t('documents.subtitle')}
      onBack={() => navigation.goBack()}>
      {DOC_KEYS.map(key => {
        const status = docs[key] ?? 'pending';
        const preview = previews[key];
        return (
          <View
            key={key}
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <AppIcon name={DOC_ICONS[key]} size={20} color={BrandColors.accentOrange} solid />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {t(`documents.${key}`)}
                </Text>
                <StatusPill
                  label={t(`documents.status.${status}`)}
                  tone={statusTone(status)}
                />
              </View>
            </View>

            {preview ? (
              <Image source={{ uri: preview }} style={styles.preview} resizeMode="cover" />
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={() => handleUpload(key)}
                style={[styles.actionBtn, { borderColor: BrandColors.accentOrange }]}>
                <AppIcon name="upload" size={14} color={BrandColors.accentOrange} />
                <Text style={styles.actionText}>{t('documents.upload')}</Text>
              </Pressable>
              {status === 'uploaded' ? (
                <Pressable
                  onPress={() => Alert.alert(t('documents.title'), t('documents.viewOnly'))}
                  style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: theme.cardBorder }]}>
                  <AppIcon name="eye" size={14} color={theme.textSecondary} />
                  <Text style={[styles.actionTextOutline, { color: theme.textSecondary }]}>
                    {t('documents.view')}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        );
      })}

      <Pressable
        onPress={() => navigation.navigate('KycWizard')}
        style={[styles.kycLink, { backgroundColor: theme.elevatedSurface, borderColor: theme.cardBorder }]}>
        <AppIcon name="id-card" size={16} color={BrandColors.accentOrange} solid />
        <Text style={[styles.kycLinkText, { color: theme.text }]}>
          {t('documents.fullKyc')}
        </Text>
        <AppIcon name="chevron-right" size={14} color={theme.textMuted} />
      </Pressable>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(240, 137, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1, gap: 4 },
  cardTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
  },
  preview: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  actionBtnOutline: {
    borderColor: 'rgba(0,0,0,0.1)',
  },
  actionText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
    color: BrandColors.accentOrange,
  },
  actionTextOutline: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
  },
  kycLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Layout.cardRadius,
    borderWidth: 1,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  kycLinkText: {
    flex: 1,
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
});
