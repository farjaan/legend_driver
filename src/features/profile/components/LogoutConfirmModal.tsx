import React from 'react';
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

type Props = {
  visible: boolean;
  driverName?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function LogoutConfirmModal({
  visible,
  driverName,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}>
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <AppIcon name="sign-out-alt" size={22} color={Colors.danger} solid />
            </View>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {t('profile.logoutTitle')}
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {driverName
              ? t('profile.logoutMessageNamed', { name: driverName })
              : t('profile.logoutMessage')}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                { borderColor: theme.cardBorder, backgroundColor: theme.screenBackground },
              ]}
              onPress={onCancel}
              activeOpacity={0.8}>
              <Text style={[styles.cancelText, { color: theme.text }]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
            <PrimaryButton
              label={t('profile.logoutConfirm')}
              variant="danger"
              onPress={onConfirm}
              style={styles.confirmBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Layout.cardRadius + 4,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    shadowColor: BrandColors.brandDeep,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: APP_FONTS.bold,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
  },
});
