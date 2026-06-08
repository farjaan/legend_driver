import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { FormField } from '@components/ui/FormField';
import { ChipSelect } from '@components/ui/ChipSelect';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { AppIcon } from '@components/icons';
import { supportService } from '@api/services/supportService';
import { usePhotoPicker } from '@hooks/usePhotoPicker';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type {
  SupportTicketCategory,
  SupportTicketPriority,
} from '@domain/support.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SupportStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<SupportStackParamList, 'CreateSupportTicket'>;

const CATEGORIES: SupportTicketCategory[] = [
  'vehicle',
  'app',
  'customer',
  'payment',
  'booking',
  'document',
];

const PRIORITIES: SupportTicketPriority[] = ['low', 'medium', 'high'];

export function CreateSupportTicketScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [category, setCategory] = useState<SupportTicketCategory>('vehicle');
  const [priority, setPriority] = useState<SupportTicketPriority>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location] = useState('Dubai, UAE');
  const [submitting, setSubmitting] = useState(false);
  const { image, promptPick } = usePhotoPicker({ t });

  const canSubmit = useMemo(
    () => subject.trim().length >= 5 && description.trim().length >= 10,
    [subject, description],
  );

  const categoryLabels = CATEGORIES.map(c => t(`support.category.${c}`));
  const priorityLabels = PRIORITIES.map(p => t(`support.priority.${p}`));

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const ticket = await supportService.createTicket({
        category,
        priority,
        subject: subject.trim(),
        description: description.trim(),
        location,
        attachment_uri: image?.uri,
      });
      navigation.replace('SupportTicketDetail', { ticketId: ticket.ticket_id });
    } catch {
      Alert.alert(t('common.error'), t('support.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenScaffold
      title={t('support.createTitle')}
      subtitle={t('support.createSub')}
      onBack={() => navigation.goBack()}>
      <SectionCard title={t('support.formCategory')}>
        <ChipSelect
          options={categoryLabels}
          value={t(`support.category.${category}`)}
          onChange={label => {
            const idx = categoryLabels.indexOf(label);
            if (idx >= 0) setCategory(CATEGORIES[idx]);
          }}
        />
      </SectionCard>

      <SectionCard title={t('support.formPriority')}>
        <ChipSelect
          options={priorityLabels}
          value={t(`support.priority.${priority}`)}
          onChange={label => {
            const idx = priorityLabels.indexOf(label);
            if (idx >= 0) setPriority(PRIORITIES[idx]);
          }}
        />
      </SectionCard>

      <SectionCard title={t('support.formDetails')}>
        <FormField
          label={t('support.formSubject')}
          value={subject}
          onChangeText={setSubject}
          placeholder={t('support.subjectPlaceholder')}
        />
        <FormField
          label={t('support.formDescription')}
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.multiline}
          placeholder={t('support.descriptionPlaceholder')}
        />
        <FormField label={t('support.formLocation')} value={location} editable={false} />

        <Text style={[styles.attachLabel, { color: theme.text }]}>{t('support.attachments')}</Text>
        <Pressable
          onPress={promptPick}
          style={[styles.attachBox, { borderColor: theme.cardBorder, backgroundColor: theme.elevatedSurface }]}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.attachPreview} resizeMode="cover" />
          ) : (
            <>
              <AppIcon name="paperclip" size={20} color={BrandColors.accentOrange} />
              <Text style={[styles.attachHint, { color: theme.textSecondary }]}>
                {t('support.attachHint')}
              </Text>
            </>
          )}
        </Pressable>
      </SectionCard>

      <PrimaryButton
        label={t('support.submitTicket')}
        onPress={submit}
        loading={submitting}
        disabled={!canSubmit}
        style={styles.submit}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  attachLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  attachBox: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  attachPreview: { width: '100%', height: '100%' },
  attachHint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    marginTop: 6,
  },
  submit: { marginBottom: Spacing.lg },
});
