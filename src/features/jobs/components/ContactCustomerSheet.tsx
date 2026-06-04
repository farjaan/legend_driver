import React from 'react';
import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  visible: boolean;
  maskedPhone: string;
  onClose: () => void;
};

export function ContactCustomerSheet({ visible, maskedPhone, onClose }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const handleCall = () => {
    const dialNumber = maskedPhone.replace(/\s|\*/g, '').replace('(masked)', '');
    void Linking.openURL(`tel:${dialNumber}`).catch(() => null);
    onClose();
  };

  const handleSms = () => {
    const dialNumber = maskedPhone.replace(/\s|\*/g, '').replace('(masked)', '');
    void Linking.openURL(
      Platform.OS === 'ios' ? `sms:${dialNumber}` : `sms:${dialNumber}`,
    ).catch(() => null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
        <View style={[styles.handle, { backgroundColor: theme.cardBorder }]} />

        <Text style={[styles.title, { color: theme.text }]}>{t('contact.title')}</Text>

        <View style={[styles.phonePill, { backgroundColor: theme.elevatedSurface, borderColor: theme.cardBorder }]}>
          <AppIcon name="phone" size={14} color={BrandColors.accentOrange} solid />
          <Text style={[styles.maskedPhone, { color: theme.text }]}>{maskedPhone}</Text>
          <Text style={[styles.maskedBadge, { color: theme.textSecondary }]}>{t('contact.maskedNumber')}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: BrandColors.brandDeep }]}
            onPress={handleCall}
            activeOpacity={0.8}>
            <AppIcon name="phone" size={20} color="#fff" solid />
            <Text style={styles.actionLabel}>{t('contact.call')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: BrandColors.accentOrange }]}
            onPress={handleSms}
            activeOpacity={0.8}>
            <AppIcon name="comment-sms" size={20} color="#fff" solid />
            <Text style={styles.actionLabel}>{t('contact.sms')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.note, { color: theme.textSecondary }]}>{t('contact.callNote')}</Text>

        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
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
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  maskedPhone: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    flex: 1,
  },
  maskedBadge: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Layout.cardRadius,
  },
  actionLabel: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    color: '#fff',
  },
  note: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
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
