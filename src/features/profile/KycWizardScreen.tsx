import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Asset } from 'react-native-image-picker';
import {
  isImagePickerAvailable,
  pickImageFromCamera,
  pickImageFromLibrary,
  showImagePickerUnavailableAlert,
} from '@utils/mediaPicker';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { FormField } from '@components/ui/FormField';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { AppIcon } from '@components/icons';
import { PlaceholderImages } from '@assets/placeholders';
import { useAuthStore } from '@store/authStore';
import { APP_FONTS } from '@constants/appFonts';
import { BrandColors, Colors } from '@constants/colors';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'KycWizard'>;

type StepKey = 'license' | 'id' | 'selfie' | 'vehicle' | 'review';
const STEPS: StepKey[] = ['license', 'id', 'selfie', 'vehicle', 'review'];

/* Single image captured/picked by user */
type CapturedImage = { uri: string; fileName?: string };

export function KycWizardScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const profile = useAuthStore(s => s.profile);
  const updateProfile = useAuthStore(s => s.updateProfile);

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex]!;

  /* Step 1: license */
  const [licenseNumber, setLicenseNumber] = useState('DL-971-448821');
  const [licenseExpiry, setLicenseExpiry] = useState(profile?.license_expiry ?? '2026-11-15');

  /* Step 2: documents (front + back) */
  const [idFrontImage, setIdFrontImage] = useState<CapturedImage | null>(null);
  const [idBackImage, setIdBackImage] = useState<CapturedImage | null>(null);
  const [licenseFrontImage, setLicenseFrontImage] = useState<CapturedImage | null>(null);
  const [licenseBackImage, setLicenseBackImage] = useState<CapturedImage | null>(null);

  /* Step 3: selfie */
  const [selfieImage, setSelfieImage] = useState<CapturedImage | null>(null);

  /* Step 4: vehicle */
  const [selectedVehicle, setSelectedVehicle] = useState(
    profile?.fleet_vehicles?.[0]?.plate_number ?? '',
  );

  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 'license') return licenseNumber.trim().length > 4 && licenseExpiry.trim().length > 0;
    if (step === 'id') {
      return (
        Boolean(idFrontImage) &&
        Boolean(idBackImage) &&
        Boolean(licenseFrontImage) &&
        Boolean(licenseBackImage)
      );
    }
    if (step === 'selfie') return Boolean(selfieImage);
    if (step === 'vehicle') return Boolean(selectedVehicle);
    return true;
  }, [
    idBackImage,
    idFrontImage,
    licenseBackImage,
    licenseFrontImage,
    licenseExpiry,
    licenseNumber,
    selectedVehicle,
    selfieImage,
    step,
  ]);

  const next = () => {
    if (!canContinue) { setShowErrors(true); return; }
    setShowErrors(false);
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  };
  const back = () => { setShowErrors(false); setStepIndex(i => Math.max(i - 1, 0)); };

  const submit = async () => {
    setSubmitting(true);
    await new Promise<void>(r => setTimeout(r, 700));
    updateProfile({ license_expiry: licenseExpiry, kyc_status: 'approved' });
    setSubmitting(false);
    navigation.goBack();
  };

  /* ─── helpers ─── */
  const applyPickerResult = (result: { assets?: Asset[]; didCancel?: boolean; errorCode?: string; errorMessage?: string }, onDone: (img: CapturedImage) => void) => {
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert(t('kyc.cameraErrorTitle'), result.errorMessage ?? t('kyc.cameraErrorGeneric'));
      return;
    }
    if (result.assets?.[0]?.uri) {
      const a = result.assets[0];
      onDone({ uri: a.uri!, fileName: a.fileName });
    }
  };

  const pickFromLibrary = async (onDone: (img: CapturedImage) => void) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    try {
      const result = await pickImageFromLibrary({ mediaType: 'photo', quality: 1 }, t);
      applyPickerResult(result, onDone);
    } catch {
      showImagePickerUnavailableAlert(t);
    }
  };

  const pickFromCamera = async (onDone: (img: CapturedImage) => void, front = false) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    try {
      const result = await pickImageFromCamera(
        {
          mediaType: 'photo',
          quality: 1,
          cameraType: front ? 'front' : 'back',
          saveToPhotos: false,
        },
        t,
      );
      applyPickerResult(result, onDone);
    } catch {
      showImagePickerUnavailableAlert(t);
    }
  };

  const promptDocUpload = (setter: (img: CapturedImage) => void) => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    Alert.alert(t('kyc.uploadSource'), undefined, [
      { text: t('kyc.sourceCamera'), onPress: () => void pickFromCamera(setter) },
      { text: t('kyc.sourceGallery'), onPress: () => void pickFromLibrary(setter) },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  return (
    <ScreenScaffold
      title={t('kyc.title')}
      subtitle={t(`kyc.step.${step}`)}
      onBack={() => navigation.goBack()}>

      {/* ── Progress bar ── */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { backgroundColor: theme.cardBorder }]}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.progressMeta}>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {t('kyc.progress', { current: stepIndex + 1, total: STEPS.length })}
          </Text>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {t(`kyc.step.${step}`)}
          </Text>
        </View>
      </View>

      {/* ──────────── STEP 1: License ──────────── */}
      {step === 'license' ? (
        <SectionCard title={t('kyc.licenseTitle')}>
          <FormField label={t('kyc.licenseNumber')} value={licenseNumber} onChangeText={setLicenseNumber} />
          <FormField
            label={t('kyc.licenseExpiry')}
            value={licenseExpiry}
            onChangeText={setLicenseExpiry}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
          />
          {showErrors && licenseNumber.trim().length <= 4 ? (
            <ErrorText>{t('kyc.error.licenseNumber')}</ErrorText>
          ) : null}
          {showErrors && !licenseExpiry.trim() ? (
            <ErrorText>{t('kyc.error.licenseExpiry')}</ErrorText>
          ) : null}
          <HintText>{t('kyc.licenseHint')}</HintText>
        </SectionCard>
      ) : null}

      {/* ──────────── STEP 2: Documents (front + back) ──────────── */}
      {step === 'id' ? (
        <>
          <SectionCard title={t('kyc.emiratesIdSection')}>
            <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>{t('kyc.uploadIdSub')}</Text>
            <DocumentSidesRow
              frontLabel={t('kyc.front')}
              backLabel={t('kyc.back')}
              frontImage={idFrontImage}
              backImage={idBackImage}
              onFrontPress={() => promptDocUpload(setIdFrontImage)}
              onBackPress={() => promptDocUpload(setIdBackImage)}
            />
          </SectionCard>

          <SectionCard title={t('kyc.licensePhotoSection')}>
            <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>{t('kyc.uploadLicenseSub')}</Text>
            <DocumentSidesRow
              frontLabel={t('kyc.front')}
              backLabel={t('kyc.back')}
              frontImage={licenseFrontImage}
              backImage={licenseBackImage}
              onFrontPress={() => promptDocUpload(setLicenseFrontImage)}
              onBackPress={() => promptDocUpload(setLicenseBackImage)}
            />
          </SectionCard>

          {showErrors &&
          !(idFrontImage && idBackImage && licenseFrontImage && licenseBackImage) ? (
            <ErrorText>{t('kyc.error.documents')}</ErrorText>
          ) : null}
          <HintText>{t('kyc.docsHint')}</HintText>
        </>
      ) : null}

      {/* ──────────── STEP 3: Selfie ──────────── */}
      {step === 'selfie' ? (
        <SectionCard title={t('kyc.selfieTitle')}>
          <SelfiePanel
            image={selfieImage}
            onCamera={() => pickFromCamera(setSelfieImage, true)}
            onGallery={() => pickFromLibrary(setSelfieImage)}
          />
          {showErrors && !selfieImage ? (
            <ErrorText style={{ textAlign: 'center', marginTop: 8 }}>
              {t('kyc.error.selfie')}
            </ErrorText>
          ) : null}
          <HintText style={{ textAlign: 'center' }}>{t('kyc.selfieHint')}</HintText>
        </SectionCard>
      ) : null}

      {/* ──────────── STEP 4: Vehicle ──────────── */}
      {step === 'vehicle' ? (
        <SectionCard title={t('kyc.vehicleTitle')}>
          {(profile?.fleet_vehicles ?? []).map((v, idx, arr) => {
            const active = selectedVehicle === v.plate_number;
            return (
              <TouchableOpacity
                key={v.vehicle_id}
                onPress={() => setSelectedVehicle(v.plate_number)}
                activeOpacity={0.85}
                style={[
                  styles.vehicleRow,
                  { borderBottomColor: theme.cardBorder },
                  idx < arr.length - 1 && styles.vehicleBorder,
                ]}>
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.vehicleTitle, { color: theme.text }]}>
                    {v.make} {v.model} · {v.year}
                  </Text>
                  <Text style={[styles.vehicleSub, { color: theme.textSecondary }]}>{v.plate_number}</Text>
                </View>
                {active ? (
                  <AppIcon name="check-circle" size={16} color={BrandColors.accentOrange} solid />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </SectionCard>
      ) : null}

      {/* ──────────── STEP 5: Review ──────────── */}
      {step === 'review' ? (
        <>
          <SectionCard title={t('kyc.reviewTitle')}>
            <ReviewRow label={t('kyc.licenseNumber')} value={licenseNumber} />
            <ReviewRow label={t('kyc.licenseExpiry')} value={licenseExpiry} />
            <ReviewRow label={t('kyc.vehicleTitle')} value={selectedVehicle} last />
          </SectionCard>

          {/* Thumbnail gallery */}
          <SectionCard title={t('kyc.uploadedDocs')}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              {[
                { label: `${t('kyc.uploadId')} · ${t('kyc.front')}`, img: idFrontImage },
                { label: `${t('kyc.uploadId')} · ${t('kyc.back')}`, img: idBackImage },
                { label: `${t('kyc.uploadLicense')} · ${t('kyc.front')}`, img: licenseFrontImage },
                { label: `${t('kyc.uploadLicense')} · ${t('kyc.back')}`, img: licenseBackImage },
                { label: t('kyc.uploadSelfie'), img: selfieImage },
              ].map(({ label, img }) => (
                <View key={label} style={styles.reviewThumbWrap}>
                  <Image
                    source={img?.uri ? { uri: img.uri } : PlaceholderImages.signatureSample}
                    style={styles.reviewThumb}
                    resizeMode="cover"
                  />
                  <Text style={[styles.reviewThumbLabel, { color: theme.textSecondary }]}>{label}</Text>
                </View>
              ))}
            </ScrollView>
          </SectionCard>

          <PrimaryButton
            label={t('kyc.submit')}
            onPress={submit}
            loading={submitting}
            style={{ marginBottom: Spacing.xl }}
          />
        </>
      ) : (
        <PrimaryButton label={t('common.continue')} onPress={next} style={{ marginBottom: Spacing.sm }} />
      )}

      {stepIndex > 0 && step !== 'review' ? (
        <TouchableOpacity onPress={back} style={styles.backLink}>
          <Text style={[styles.backText, { color: theme.textSecondary }]}>{t('common.back')}</Text>
        </TouchableOpacity>
      ) : null}
    </ScreenScaffold>
  );
}

/* ──────────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────────── */

function DocumentSidesRow({
  frontLabel,
  backLabel,
  frontImage,
  backImage,
  onFrontPress,
  onBackPress,
}: {
  frontLabel: string;
  backLabel: string;
  frontImage: CapturedImage | null;
  backImage: CapturedImage | null;
  onFrontPress: () => void;
  onBackPress: () => void;
}) {
  return (
    <View style={styles.sidesRow}>
      <DocumentSideBox label={frontLabel} image={frontImage} onPress={onFrontPress} />
      <DocumentSideBox label={backLabel} image={backImage} onPress={onBackPress} />
    </View>
  );
}

function DocumentSideBox({
  label,
  image,
  onPress,
}: {
  label: string;
  image: CapturedImage | null;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const uploaded = Boolean(image);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.sideBoxWrap}>
      <Text style={[styles.sideLabel, { color: theme.text }]}>{label}</Text>
      <View
        style={[
          styles.sideBox,
          {
            borderColor: uploaded ? BrandColors.accentOrange : theme.cardBorder,
            backgroundColor: theme.elevatedSurface,
          },
        ]}>
        {uploaded ? (
          <>
            <Image source={{ uri: image!.uri }} style={styles.sideBoxImage} resizeMode="cover" />
            <View style={styles.sideBoxBadge}>
              <AppIcon name="check" size={10} color="#fff" solid />
            </View>
          </>
        ) : (
          <View style={styles.sideBoxEmpty}>
            <AppIcon name="camera" size={22} color={BrandColors.accentOrange} solid />
            <Text style={[styles.sideBoxHint, { color: theme.textSecondary }]}>{t('kyc.tapToCapture')}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function SelfiePanel({
  image,
  onCamera,
  onGallery,
}: {
  image: CapturedImage | null;
  onCamera: () => void;
  onGallery: () => void;
}) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.selfieWrap}>
      <View style={[styles.selfieCircle, { borderColor: image ? BrandColors.accentOrange : theme.cardBorder }]}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.selfieImg} resizeMode="cover" />
        ) : (
          <AppIcon name="user" size={40} color={theme.cardBorder} solid />
        )}
      </View>

      <View style={styles.selfieActions}>
        <TouchableOpacity
          style={[styles.selfieBtn, { backgroundColor: BrandColors.brandDeep }]}
          onPress={onCamera}
          activeOpacity={0.85}>
          <AppIcon name="camera" size={16} color="#fff" solid />
          <Text style={styles.selfieBtnText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selfieBtn, { backgroundColor: BrandColors.accentOrange }]}
          onPress={onGallery}
          activeOpacity={0.85}>
          <AppIcon name="images" size={16} color="#fff" solid />
          <Text style={styles.selfieBtnText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* Small helpers */
function HintText({ children, style }: { children: React.ReactNode; style?: object }) {
  const { theme } = useAppTheme();
  return (
    <Text style={[styles.hint, { color: theme.textSecondary }, style]}>{children}</Text>
  );
}

function ErrorText({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[styles.errorText, style]}>{children}</Text>;
}

function ReviewRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.reviewRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.cardBorder },
      ]}>
      <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.reviewValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

/* ──────────────────────────────────────────────────
   Styles
────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  /* Progress */
  progressWrap: { marginBottom: Spacing.md },
  progressTrack: { height: 8, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 999, backgroundColor: BrandColors.accentOrange },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { fontFamily: APP_FONTS.regular, fontSize: 12 },

  /* Misc */
  hint: { fontFamily: APP_FONTS.regular, fontSize: 12, lineHeight: 17, marginTop: Spacing.sm },
  errorText: { fontFamily: APP_FONTS.regular, fontSize: 12, lineHeight: 16, color: Colors.danger, marginTop: 6 },

  sectionSub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  sidesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sideBoxWrap: {
    flex: 1,
  },
  sideLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  sideBox: {
    height: 148,
    borderRadius: Layout.cardRadius,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBoxImage: {
    width: '100%',
    height: '100%',
  },
  sideBoxBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBoxEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  sideBoxHint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
    textAlign: 'center',
  },

  /* Selfie */
  selfieWrap: { alignItems: 'center', paddingVertical: Spacing.md },
  selfieCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  selfieImg: { width: '100%', height: '100%' },
  selfieActions: { flexDirection: 'row', gap: Spacing.md },
  selfieBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Layout.cardRadius,
  },
  selfieBtnText: { fontFamily: APP_FONTS.bold, fontSize: 14, color: '#fff' },

  /* Vehicle */
  vehicleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: Spacing.md },
  vehicleBorder: { borderBottomWidth: StyleSheet.hairlineWidth },
  vehicleTitle: { fontFamily: APP_FONTS.bold, fontSize: 14, lineHeight: 18 },
  vehicleSub: { fontFamily: APP_FONTS.regular, fontSize: 12, marginTop: 2 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#9CA3AF',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: BrandColors.accentOrange },
  radioDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: BrandColors.accentOrange },

  /* Review */
  reviewRow: { paddingVertical: 10 },
  reviewLabel: { fontFamily: APP_FONTS.regular, fontSize: 11, lineHeight: 14 },
  reviewValue: { fontFamily: APP_FONTS.bold, fontSize: 14, marginTop: 3 },
  reviewThumbWrap: { alignItems: 'center', marginHorizontal: 6, marginBottom: 4 },
  reviewThumb: { width: 90, height: 66, borderRadius: 10 },
  reviewThumbLabel: { fontFamily: APP_FONTS.regular, fontSize: 11, marginTop: 4, textAlign: 'center' },

  /* Back link */
  backLink: { alignItems: 'center', paddingVertical: Spacing.sm, marginBottom: Spacing.xl },
  backText: { fontFamily: APP_FONTS.regular, fontSize: 13 },
});
