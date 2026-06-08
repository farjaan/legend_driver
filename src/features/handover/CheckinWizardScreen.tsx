import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Asset } from 'react-native-image-picker';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { FormField } from '@components/ui/FormField';
import { ChipSelect } from '@components/ui/ChipSelect';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { AppIcon } from '@components/icons';
import { FUEL_LEVELS } from '@config/constants';
import { handoverService } from '@api/services/handoverService';
import { useJobStore } from '@store/jobStore';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import {
  isImagePickerAvailable,
  pickImageFromCamera,
  pickImageFromLibrary,
  showImagePickerUnavailableAlert,
} from '@utils/mediaPicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckinWizard'>;

type DamagePhoto = {
  uri: string;
  fileName?: string;
};

type DamageItem = {
  id: string;
  description: string;
  cost: string;
  photo: DamagePhoto | null;
};

export function CheckinWizardScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const job = useJobStore(s => s.getJob(route.params.jobId));
  const [branch, setBranch] = useState(job?.branch_name ?? 'Legend Al Quoz');
  const [odometer, setOdometer] = useState('13102');
  const [fuel, setFuel] = useState('1/2');
  const [damages, setDamages] = useState<DamageItem[]>([]);
  const [fines, setFines] = useState('');
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addDamage = () => {
    setDamages(prev => [
      ...prev,
      { id: String(Date.now()), description: '', cost: '', photo: null },
    ]);
  };

  const removeDamage = (id: string) => {
    setDamages(prev => prev.filter(d => d.id !== id));
  };

  const updateDamage = (id: string, field: 'description' | 'cost', value: string) => {
    setDamages(prev => prev.map(d => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const setDamagePhoto = (id: string, photo: DamagePhoto | null) => {
    setDamages(prev => prev.map(d => (d.id === id ? { ...d, photo } : d)));
  };

  const applyPickerResult = (
    result: {
      assets?: Asset[];
      didCancel?: boolean;
      errorCode?: string;
      errorMessage?: string;
    },
    onDone: (photo: DamagePhoto) => void,
  ) => {
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert(t('kyc.cameraErrorTitle'), result.errorMessage ?? t('kyc.cameraErrorGeneric'));
      return;
    }
    if (result.assets?.[0]?.uri) {
      const asset = result.assets[0];
      onDone({ uri: asset.uri!, fileName: asset.fileName });
    }
  };

  const pickFromLibrary = async (onDone: (photo: DamagePhoto) => void) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    try {
      const result = await pickImageFromLibrary({ mediaType: 'photo', quality: 0.8 }, t);
      applyPickerResult(result, onDone);
    } catch {
      showImagePickerUnavailableAlert(t);
    }
  };

  const pickFromCamera = async (onDone: (photo: DamagePhoto) => void) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    try {
      const result = await pickImageFromCamera(
        { mediaType: 'photo', quality: 0.8, cameraType: 'back', saveToPhotos: false },
        t,
      );
      applyPickerResult(result, onDone);
    } catch {
      showImagePickerUnavailableAlert(t);
    }
  };

  const promptDamagePhoto = (damageId: string) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    Alert.alert(t('kyc.uploadSource'), undefined, [
      {
        text: t('kyc.sourceCamera'),
        onPress: () => void pickFromCamera(photo => setDamagePhoto(damageId, photo)),
      },
      {
        text: t('kyc.sourceGallery'),
        onPress: () => void pickFromLibrary(photo => setDamagePhoto(damageId, photo)),
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const totalDamages = damages.reduce((sum, d) => sum + (Number(d.cost) || 0), 0);
  const totalPayable = totalDamages + (Number(fines) || 0);

  const submit = async () => {
    if (!job) return;
    setSubmitting(true);
    await handoverService.submitCheckin({
      booking_id: job.booking_id,
      check_in_branch_location: branch,
      check_in_final_odometer: Number(odometer) || 0,
      check_in_fuel_level: fuel,
      check_in_damages: damages.map(d => ({
        description: d.description,
        cost: Number(d.cost) || 0,
      })),
      check_in_traffic_fines: Number(fines) || 0,
      check_in_total_damages: totalDamages,
      check_in_final_payable: String(totalPayable),
      check_in_car_photos: damages
        .filter(d => d.photo)
        .map((d, index) => ({
          image: `damage-${index + 1}`,
          uri: d.photo!.uri,
        })),
      check_in_customer_signed: signed,
    });
    setSubmitting(false);
    navigation.goBack();
  };

  if (!job) {
    return (
      <ScreenScaffold
        title={t('handover.checkinTitle')}
        onBack={() => navigation.goBack()}>
        <Text style={{ color: theme.textSecondary }}>{t('jobs.notFound')}</Text>
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold
      title={t('handover.checkinTitle')}
      subtitle={job.booking_reference}
      onBack={() => navigation.goBack()}>
      <SectionCard title={t('handover.returnDetails')}>
        <FormField label={t('handover.branch')} value={branch} onChangeText={setBranch} />
        <FormField
          label={t('handover.odometer')}
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="number-pad"
        />
        <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('handover.fuel')}</Text>
        <ChipSelect options={[...FUEL_LEVELS]} value={fuel} onChange={setFuel} />
      </SectionCard>

      <SectionCard title={t('handover.damagesFines')}>
        <Text style={[styles.photoHint, { color: theme.textSecondary }]}>
          {t('handover.damagePhotoHint')}
        </Text>

        {damages.length === 0 ? (
          <Text style={[styles.noDamages, { color: theme.textSecondary }]}>
            {t('handover.noDamages')}
          </Text>
        ) : (
          damages.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.damageBlock,
                { borderColor: theme.cardBorder, backgroundColor: theme.surface },
                index > 0 && { marginTop: Spacing.md },
              ]}>
              <View style={styles.damageHeader}>
                <Text style={[styles.damageNum, { color: theme.textSecondary }]}>
                  {t('handover.damageItem', { n: index + 1 })}
                </Text>
                <TouchableOpacity
                  onPress={() => removeDamage(item.id)}
                  hitSlop={8}
                  style={styles.removeBtn}>
                  <AppIcon name="times" size={12} color={Colors.danger} solid />
                  <Text style={styles.removeText}>{t('handover.removeDamage')}</Text>
                </TouchableOpacity>
              </View>

              <FormField
                label={t('handover.damageDesc')}
                value={item.description}
                onChangeText={v => updateDamage(item.id, 'description', v)}
                multiline
                style={styles.multiline}
              />
              <FormField
                label={t('handover.damageCost')}
                value={item.cost}
                onChangeText={v => updateDamage(item.id, 'cost', v)}
                keyboardType="number-pad"
              />

              <Text style={[styles.fieldLabel, { color: theme.text, marginTop: Spacing.sm }]}>
                {t('handover.damagePhoto')}
              </Text>
              {item.photo ? (
                <View style={styles.photoRow}>
                  <Image source={{ uri: item.photo.uri }} style={styles.thumb} />
                  <View style={styles.photoActions}>
                    <TouchableOpacity
                      style={[styles.photoActionBtn, { borderColor: theme.cardBorder }]}
                      onPress={() => promptDamagePhoto(item.id)}
                      activeOpacity={0.8}>
                      <AppIcon name="camera" size={14} color={BrandColors.accentOrange} solid />
                      <Text style={[styles.photoActionText, { color: theme.text }]}>
                        {t('handover.changeDamagePhoto')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoRemoveBtn}
                      onPress={() => setDamagePhoto(item.id, null)}
                      activeOpacity={0.8}>
                      <AppIcon name="trash-alt" size={13} color={Colors.danger} solid />
                      <Text style={styles.photoRemoveText}>{t('handover.removeDamagePhoto')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addPhotoBtn, { borderColor: BrandColors.accentOrange }]}
                  onPress={() => promptDamagePhoto(item.id)}
                  activeOpacity={0.85}>
                  <View style={styles.addPhotoIcon}>
                    <AppIcon name="camera" size={18} color={BrandColors.accentOrange} solid />
                  </View>
                  <Text style={[styles.addPhotoText, { color: BrandColors.accentOrange }]}>
                    {t('handover.addDamagePhoto')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        <TouchableOpacity
          style={[styles.addDamageBtn, { borderColor: BrandColors.accentOrange }]}
          onPress={addDamage}
          activeOpacity={0.8}>
          <AppIcon name="plus" size={13} color={BrandColors.accentOrange} solid />
          <Text style={[styles.addDamageText, { color: BrandColors.accentOrange }]}>
            {t('handover.addDamage')}
          </Text>
        </TouchableOpacity>

        <FormField
          label={t('handover.fines')}
          value={fines}
          onChangeText={setFines}
          keyboardType="number-pad"
        />
      </SectionCard>

      <TouchableOpacity
        style={[
          styles.signRow,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
        ]}
        onPress={() => setSigned(s => !s)}
        activeOpacity={0.85}>
        <View style={[styles.checkbox, signed && styles.checkboxOn]}>
          {signed ? <AppIcon name="check" size={12} color={Colors.white} solid /> : null}
        </View>
        <Text style={[styles.signLabel, { color: theme.text }]}>{t('handover.signature')}</Text>
      </TouchableOpacity>

      <SectionCard>
        <Text style={[styles.payableLabel, { color: theme.textSecondary }]}>
          {t('handover.totalPayable')}
        </Text>
        <Text style={styles.payableValue}>AED {totalPayable}</Text>
        {totalDamages > 0 ? (
          <Text style={[styles.payableBreakdown, { color: theme.textSecondary }]}>
            {t('handover.damages')} AED {totalDamages}
            {Number(fines) > 0 ? `  +  ${t('handover.fines')} AED ${fines}` : ''}
          </Text>
        ) : null}
      </SectionCard>

      <PrimaryButton
        label={t('common.submit')}
        onPress={submit}
        loading={submitting}
        disabled={!signed}
        style={styles.submit}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  multiline: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  photoHint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  noDamages: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
  damageBlock: {
    borderWidth: 1,
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
  },
  damageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  damageNum: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  removeText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    color: Colors.danger,
  },
  addDamageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Layout.cardRadius,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.md,
  },
  addDamageText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  addPhotoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(240, 137, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
  },
  photoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#E8E4ED',
  },
  photoActions: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
  },
  photoActionText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
  },
  photoRemoveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  photoRemoveText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    color: Colors.danger,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: BrandColors.accentOrange,
    borderColor: BrandColors.accentOrange,
  },
  signLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
  payableLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  payableValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 24,
    color: BrandColors.accentOrange,
    lineHeight: 28,
    marginTop: 4,
  },
  payableBreakdown: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    marginTop: 4,
  },
  submit: { marginBottom: Spacing.xl },
});
