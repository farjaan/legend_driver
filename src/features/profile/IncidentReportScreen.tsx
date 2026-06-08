import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { FormField } from '@components/ui/FormField';
import { ChipSelect } from '@components/ui/ChipSelect';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { AppIcon } from '@components/icons';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { incidentService } from '@api/services/incidentService';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'IncidentReport'>;

const TYPES = ['Vehicle', 'Customer', 'Accident', 'Other'] as const;
type IncidentType = (typeof TYPES)[number];

export function IncidentReportScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [type, setType] = useState<IncidentType>('Vehicle');
  const [location, setLocation] = useState('Dubai Marina');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => details.trim().length >= 10, [details]);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await incidentService.submitReport({
        incident_type: type,
        description: details.trim(),
        location: location.trim(),
      });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenScaffold title={t('incident.title')} subtitle={t('incident.subtitle')} onBack={() => navigation.goBack()}>
      {success ? (
        <View style={[styles.successCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.successIcon}>
            <AppIcon name="check" size={16} color={Colors.white} solid />
          </View>
          <Text style={[styles.successTitle, { color: theme.text }]}>{t('incident.successTitle')}</Text>
          <Text style={[styles.successSub, { color: theme.textSecondary }]}>{t('incident.successBody')}</Text>
          <PrimaryButton label={t('common.done')} onPress={() => navigation.goBack()} />
        </View>
      ) : (
        <>
          <SectionCard title={t('incident.formTitle')}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>{t('incident.type')}</Text>
            <ChipSelect options={[...TYPES]} value={type} onChange={v => setType(v as IncidentType)} />

            <FormField label={t('incident.location')} value={location} onChangeText={setLocation} />
            <FormField
              label={t('incident.details')}
              value={details}
              onChangeText={setDetails}
              multiline
              style={styles.multiline}
              placeholder={t('incident.detailsPlaceholder')}
            />

            <View style={[styles.helpBox, { backgroundColor: theme.elevatedSurface, borderColor: theme.cardBorder }]}>
              <AppIcon name="info-circle" size={14} color={BrandColors.accentOrange} solid />
              <Text style={[styles.helpText, { color: theme.textSecondary }]}>{t('incident.help')}</Text>
            </View>
          </SectionCard>

          <PrimaryButton
            label={t('incident.submit')}
            onPress={submit}
            loading={submitting}
            disabled={!canSubmit}
            style={styles.submit}
          />

          <TouchableOpacity onPress={() => setDetails('Minor incident reported. No injuries. Vehicle safe to drive.')} style={styles.prefill}>
            <Text style={[styles.prefillText, { color: theme.textSecondary }]}>{t('incident.prefill')}</Text>
          </TouchableOpacity>
        </>
      )}
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
    height: 110,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  helpText: {
    flex: 1,
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  submit: {
    marginBottom: Spacing.md,
  },
  prefill: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  prefillText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
  },
  successCard: {
    borderWidth: 1,
    borderRadius: Layout.cardRadius,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  successIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  successSub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});

