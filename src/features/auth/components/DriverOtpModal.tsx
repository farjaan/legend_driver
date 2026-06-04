import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@components/icons';
import { OtpCodeInput } from '@components/ui/OtpCodeInput';
import { BrandColors } from '@constants/colors';
import { useTranslation } from 'react-i18next';
import { OTP_LENGTH } from '@features/auth/constants';
import type { AuthStyles } from '@features/auth/styles/authStyles';

type Props = {
  visible: boolean;
  styles: AuthStyles;
  isRTL: boolean;
  phone: string;
  callingCode: string;
  otp: string;
  onOtpChange: (code: string) => void;
  resendTimer: number;
  isVerifying: boolean;
  isSending: boolean;
  translateY: Animated.Value;
  backdropOpacity: Animated.Value;
  onClose: () => void;
  onResend: () => void;
  onVerify: () => void;
  error?: string;
};

export function DriverOtpModal({
  visible,
  styles,
  isRTL,
  phone,
  callingCode,
  otp,
  onOtpChange,
  resendTimer,
  isVerifying,
  isSending,
  translateY,
  backdropOpacity,
  onClose,
  onResend,
  onVerify,
  error,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const canVerify = otp.length === OTP_LENGTH && !isVerifying;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}>
        <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          />
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <View style={styles.grabber} />

              <View style={styles.otpHeader}>
                <View style={styles.otpIconContainer}>
                  <AppIcon name="shield-alt" size={38} color={BrandColors.accentOrange} solid />
                </View>
                <Text style={[styles.otpTitle, isRTL ? styles.rtlText : styles.ltrText]}>
                  {t('auth.otpTitle')}
                </Text>
                <Text style={[styles.otpDesc, isRTL ? styles.rtlText : styles.ltrText]}>
                  {t('auth.otpDesc', { phone: `+${callingCode} ${phone}` })}
                </Text>
              </View>

              <OtpCodeInput
                autoFocus
                blurOnFilled
                disabled={isVerifying}
                onChange={onOtpChange}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.resendRow}>
                <Text style={styles.resendMuted}>{t('auth.resendPrompt')} </Text>
                {resendTimer > 0 ? (
                  <Text style={styles.resendMuted}>
                    {t('auth.resendIn', { seconds: resendTimer })}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={onResend} disabled={isSending}>
                    <Text style={styles.resendLink}>{t('auth.resendLink')}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.verifyBtn, !canVerify && styles.verifyBtnDisabled]}
                onPress={onVerify}
                disabled={!canVerify}
                activeOpacity={0.85}>
                {isVerifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyTxt}>{t('auth.verify')}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.changeNumber} onPress={onClose}>
                <Text style={styles.changeNumberTxt}>{t('auth.changeNumber')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
