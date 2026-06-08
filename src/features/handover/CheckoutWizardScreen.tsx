import React, { useMemo, useState } from 'react';
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
import { CAR_PHOTO_SET } from '@assets/placeholders';
import { CHECKOUT_CHECKLIST_DEFAULT, FUEL_LEVELS } from '@config/constants';
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

type Props = NativeStackScreenProps<RootStackParamList, 'CheckoutWizard'>;

type VehiclePhotoKey = (typeof CAR_PHOTO_SET)[number]['key'];

type CapturedPhoto = {
  uri: string;
  fileName?: string;
};

type FuelLevelOption = (typeof FUEL_LEVELS)[number];

const PHOTO_LABEL_KEYS: Record<VehiclePhotoKey, string> = {
  front: 'handover.photoFront',
  back: 'handover.photoRear',
  left: 'handover.photoLeft',
  right: 'handover.photoRight',
  interior: 'handover.photoInterior',
};

export function CheckoutWizardScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const job = useJobStore(s => s.getJob(route.params.jobId));
  const [odometer, setOdometer] = useState('');
  const [fuel, setFuel] = useState<FuelLevelOption>('Full');
  const [scratches, setScratches] = useState('');
  const [checklist, setChecklist] = useState<string[]>([...CHECKOUT_CHECKLIST_DEFAULT]);
  const [photos, setPhotos] = useState<Partial<Record<VehiclePhotoKey, CapturedPhoto>>>({});
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const capturedCount = useMemo(
    () => CAR_PHOTO_SET.filter(slot => photos[slot.key]).length,
    [photos],
  );

  const toggleCheck = (item: string) => {
    setChecklist(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item],
    );
  };

  const setPhoto = (key: VehiclePhotoKey, photo: CapturedPhoto | null) => {
    setPhotos(prev => {
      const next = { ...prev };
      if (photo) next[key] = photo;
      else delete next[key];
      return next;
    });
  };

  const applyPickerResult = (
    result: {
      assets?: Asset[];
      didCancel?: boolean;
      errorCode?: string;
      errorMessage?: string;
    },
    onDone: (photo: CapturedPhoto) => void,
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

  const pickFromLibrary = async (onDone: (photo: CapturedPhoto) => void) => {
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

  const pickFromCamera = async (onDone: (photo: CapturedPhoto) => void) => {
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

  const promptPhoto = (key: VehiclePhotoKey) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    Alert.alert(t('kyc.uploadSource'), undefined, [
      {
        text: t('kyc.sourceCamera'),
        onPress: () => void pickFromCamera(photo => setPhoto(key, photo)),
      },
      {
        text: t('kyc.sourceGallery'),
        onPress: () => void pickFromLibrary(photo => setPhoto(key, photo)),
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const submit = async () => {
    if (!job) return;
    setSubmitting(true);
    await handoverService.submitCheckout({
      booking_id: job.booking_id,
      checkout_oldmeter_reading: Number(odometer) || 0,
      checkout_fuel_level: fuel,
      checkout_car_checklist: checklist,
      checkout_existing_scratches: scratches,
      checkout_car_photos: CAR_PHOTO_SET.filter(slot => photos[slot.key]).map(slot => ({
        image: slot.key,
        uri: photos[slot.key]!.uri,
      })),
      checkout_customer_signed: signed,
    });
    setSubmitting(false);
    navigation.goBack();
  };

  if (!job) {
    return (
      <ScreenScaffold
        title={t('handover.checkoutTitle')}
        onBack={() => navigation.goBack()}>
        <Text style={{ color: theme.textSecondary }}>{t('jobs.notFound')}</Text>
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold
      title={t('handover.checkoutTitle')}
      subtitle={job.booking_reference}
      onBack={() => navigation.goBack()}>
      <SectionCard title={t('handover.vehicleCondition')}>
        <FormField
          label={t('handover.odometer')}
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="number-pad"
        />
        <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('handover.fuel')}</Text>
        <ChipSelect options={[...FUEL_LEVELS]} value={fuel} onChange={setFuel} />
        <FormField
          label={t('handover.scratches')}
          value={scratches}
          onChangeText={setScratches}
          multiline
          placeholder={t('handover.scratchesPlaceholder')}
          style={styles.multiline}
        />
      </SectionCard>

      <SectionCard title={t('handover.checklist')}>
        {CHECKOUT_CHECKLIST_DEFAULT.map((item, index) => {
          const checked = checklist.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.checkRow,
                index < CHECKOUT_CHECKLIST_DEFAULT.length - 1 && styles.checkBorder,
              ]}
              onPress={() => toggleCheck(item)}
              activeOpacity={0.8}>
              <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                {checked ? (
                  <AppIcon name="check" size={12} color={Colors.white} solid />
                ) : null}
              </View>
              <Text
                style={[
                  styles.checkLabel,
                  { color: checked ? theme.text : theme.textSecondary },
                  checked && styles.checkLabelOn,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SectionCard>

      <SectionCard title={t('handover.photos')}>
        <Text style={[styles.photoHint, { color: theme.textSecondary }]}>
          {t('handover.photosHint')}
        </Text>
        <Text style={[styles.photoProgress, { color: theme.text }]}>
          {t('handover.photosProgress', {
            count: capturedCount,
            total: CAR_PHOTO_SET.length,
          })}
        </Text>

        <View style={styles.photoGrid}>
          {CAR_PHOTO_SET.map(slot => {
            const captured = photos[slot.key];
            return (
              <View
                key={slot.key}
                style={[styles.photoSlot, { borderColor: theme.cardBorder, backgroundColor: theme.surface }]}>
                <Text style={[styles.photoSlotLabel, { color: theme.text }]}>
                  {t(PHOTO_LABEL_KEYS[slot.key])}
                </Text>
                {captured ? (
                  <>
                    <TouchableOpacity onPress={() => promptPhoto(slot.key)} activeOpacity={0.9}>
                      <Image source={{ uri: captured.uri }} style={styles.thumb} />
                    </TouchableOpacity>
                    <View style={styles.photoSlotActions}>
                      <TouchableOpacity
                        onPress={() => promptPhoto(slot.key)}
                        hitSlop={8}
                        style={styles.photoSlotAction}>
                        <AppIcon name="camera" size={12} color={BrandColors.accentOrange} solid />
                        <Text style={[styles.photoSlotActionText, { color: theme.textSecondary }]}>
                          {t('handover.changeDamagePhoto')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setPhoto(slot.key, null)}
                        hitSlop={8}
                        style={styles.photoSlotAction}>
                        <AppIcon name="trash-alt" size={12} color={Colors.danger} solid />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.addPhotoSlot, { borderColor: BrandColors.accentOrange }]}
                    onPress={() => promptPhoto(slot.key)}
                    activeOpacity={0.85}>
                    <AppIcon name="camera" size={20} color={BrandColors.accentOrange} solid />
                    <Text style={[styles.addPhotoSlotText, { color: BrandColors.accentOrange }]}>
                      {t('handover.addDamagePhoto')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
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
    height: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  checkBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Layout.cardBorder,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Layout.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  checkboxOn: {
    backgroundColor: BrandColors.accentOrange,
    borderColor: BrandColors.accentOrange,
  },
  checkLabel: {
    flex: 1,
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  checkLabelOn: {
    fontFamily: APP_FONTS.bold,
  },
  photoHint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.xs,
  },
  photoProgress: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoSlot: {
    width: '48%',
    borderWidth: 1,
    borderRadius: Layout.cardRadius,
    padding: Spacing.sm,
  },
  photoSlotLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  thumb: {
    width: '100%',
    height: 88,
    borderRadius: 10,
    backgroundColor: '#E8E4ED',
  },
  photoSlotActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  photoSlotAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoSlotActionText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
  },
  addPhotoSlot: {
    height: 88,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addPhotoSlotText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 11,
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
  signLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
  submit: { marginBottom: Spacing.xl },
});
