import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { RejectReason } from '@domain/job.types';

type Props = {
  visible: boolean;
  onConfirm: (reason: RejectReason) => void;
  onCancel: () => void;
};

const REASONS: { key: RejectReason; icon: string }[] = [
  { key: 'busy', icon: 'clock' },
  { key: 'traffic', icon: 'car' },
  { key: 'vehicle_issue', icon: 'tools' },
  { key: 'other', icon: 'ellipsis-h' },
];

export function RejectReasonModal({ visible, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [selected, setSelected] = useState<RejectReason>('busy');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
        <View style={[styles.handle, { backgroundColor: theme.cardBorder }]} />
        <Text style={[styles.title, { color: theme.text }]}>{t('jobs.rejectTitle')}</Text>

        <View style={styles.reasons}>
          {REASONS.map(r => {
            const active = selected === r.key;
            const labelKey = r.key === 'vehicle_issue' ? 'vehicle' : r.key;
            return (
              <TouchableOpacity
                key={r.key}
                style={[
                  styles.reasonRow,
                  { borderColor: theme.cardBorder },
                  active && styles.reasonRowActive,
                ]}
                onPress={() => setSelected(r.key)}
                activeOpacity={0.8}>
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
                <AppIcon
                  name={r.icon}
                  size={14}
                  color={active ? BrandColors.accentOrange : theme.textSecondary}
                  solid
                />
                <Text style={[styles.reasonLabel, { color: active ? theme.text : theme.textSecondary }]}>
                  {t(`jobs.rejectReason.${labelKey}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <PrimaryButton
          label={t('jobs.rejectConfirm')}
          variant="danger"
          onPress={() => onConfirm(selected)}
          style={styles.confirmBtn}
        />
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: theme.textSecondary }]}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: APP_FONTS.bold,
    fontSize: 17,
    lineHeight: 22,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  reasons: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
  },
  reasonRowActive: {
    borderColor: BrandColors.accentOrange,
    backgroundColor: 'rgba(240,137,0,0.06)',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: BrandColors.accentOrange,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.accentOrange,
  },
  reasonLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  confirmBtn: {
    marginBottom: Spacing.sm,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
  },
});
