import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckoutWizard'>;

export function CheckoutWizardScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const job = useJobStore(s => s.getJob(route.params.jobId));
  const [odometer, setOdometer] = useState('12450');
  const [fuel, setFuel] = useState('Full');
  const [scratches, setScratches] = useState('Minor scratch rear bumper passenger side');
  const [checklist, setChecklist] = useState<string[]>([...CHECKOUT_CHECKLIST_DEFAULT]);
  const [signed, setSigned] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const toggleCheck = (item: string) => {
    setChecklist(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item],
    );
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
      checkout_car_photos: CAR_PHOTO_SET.map(p => ({
        image: p.key,
        local_source: p.source,
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
        <Text>{t('jobs.notFound')}</Text>
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
          style={styles.multiline}
        />
      </SectionCard>

      <SectionCard title={t('handover.checklist')}>
        {CHECKOUT_CHECKLIST_DEFAULT.map((item, index) => {
          const checked = checklist.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[styles.checkRow, index < CHECKOUT_CHECKLIST_DEFAULT.length - 1 && styles.checkBorder]}
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CAR_PHOTO_SET.map(p => (
            <Image key={p.key} source={p.source} style={styles.thumb} />
          ))}
        </ScrollView>
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
  thumb: {
    width: 100,
    height: 76,
    borderRadius: 10,
    marginRight: Spacing.sm,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  signLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
  submit: { marginBottom: Spacing.xl },
});
