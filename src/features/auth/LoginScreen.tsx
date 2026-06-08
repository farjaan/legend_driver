import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { AppIcon } from '@components/icons';
import { useTranslation } from 'react-i18next';
import { authService } from '@api/services/authService';
import { loginScreenBackground } from '@constants/imageAssets';
import { BrandColors } from '@constants/colors';
import { useLanguage } from '@hooks/useLanguage';
import { useAppTheme } from '@theme/useAppTheme';
import { useAuthStore } from '@store/authStore';
import { createAuthStyles } from '@features/auth/styles/authStyles';
import { RESEND_SECONDS } from '@features/auth/constants';
import { useOtpModalAnimation } from '@features/auth/hooks/useOtpModalAnimation';
import { useResendTimer } from '@features/auth/hooks/useResendTimer';
import { DriverOtpModal } from '@features/auth/components/DriverOtpModal';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createAuthStyles(theme), [theme]);
  const loginWithOtp = useAuthStore(s => s.loginWithOtp);
  const isLoading = useAuthStore(s => s.isLoading);

  const [cca2, setCca2] = useState<CountryCode>('AE');
  const [callingCode, setCallingCode] = useState('971');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const minLen = callingCode === '971' ? 9 : 10;
  const canContinue = phone.trim().length >= minLen;

  const closeOtpModal = useCallback(() => {
    setIsOtpVisible(false);
    setOtp('');
    setError('');
  }, []);

  const { translateY, backdropOpacity, open: openOtpAnim, close: closeOtpAnim } =
    useOtpModalAnimation(closeOtpModal);

  useResendTimer(resendTimer, isOtpVisible, setResendTimer);

  const sendOtp = useCallback(async () => {
    if (!canContinue || isSending) return;
    setError('');
    setIsSending(true);
    try {
      await authService.sendLoginOtp({ phone, country_code: callingCode });
      setResendTimer(RESEND_SECONDS);
      setIsOtpVisible(true);
      openOtpAnim();
    } catch {
      setError(t('auth.sendOtpFailed'));
    } finally {
      setIsSending(false);
    }
  }, [canContinue, callingCode, isSending, openOtpAnim, phone, t]);

  const verifyOtp = useCallback(async () => {
    setError('');
    const ok = await loginWithOtp(phone, otp);
    if (!ok) {
      setError(t('auth.invalidOtp'));
    }
  }, [loginWithOtp, otp, phone, t]);

  const resendOtp = useCallback(async () => {
    if (resendTimer > 0 || isSending) return;
    await sendOtp();
  }, [isSending, resendTimer, sendOtp]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.bg}>
          <Image source={loginScreenBackground} style={styles.bgImage} resizeMode="cover" />
          <View style={styles.overlay} />

          <View style={styles.sheet}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <View style={styles.welcomeSection}>
                <View style={styles.welcomeIconContainer}>
                  <AppIcon name="car" size={32} color={BrandColors.accentOrange} solid />
                </View>
                <Text style={styles.brandBadge}>LEGEND DRIVER</Text>
                <Text style={[styles.title, isRTL ? styles.rtlText : styles.ltrText]}>
                  {t('auth.welcome')}
                </Text>
                <Text style={[styles.subtitle, isRTL ? styles.rtlText : styles.ltrText]}>
                  {t('auth.subtitle')}
                </Text>
              </View>

              <View style={styles.phoneRow}>
                <View style={styles.ccWrap}>
                  <CountryPicker
                    countryCode={cca2}
                    withFilter
                    withFlag
                    withCallingCode
                    withModal
                    onSelect={country => {
                      setCca2(country.cca2);
                      setCallingCode(country.callingCode?.[0] ?? '971');
                    }}
                    containerButtonStyle={styles.countryPickerBtn}
                  />
                  <Text style={styles.callingCode}>+{callingCode}</Text>
                </View>
                <View style={styles.divider} />
                <TextInput
                  style={[styles.phoneInput, isRTL ? styles.rtlText : styles.ltrText]}
                  placeholder={t('auth.phonePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={v => setPhone(v.replace(/\D/g, ''))}
                  maxLength={15}
                />
              </View>

              {error && !isOtpVisible ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <TouchableOpacity
                style={[styles.primaryBtn, !canContinue && styles.primaryBtnDisabled]}
                onPress={sendOtp}
                disabled={!canContinue || isSending}
                activeOpacity={0.88}>
                {isSending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryTxt}>{t('auth.continue')}</Text>
                )}
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      <DriverOtpModal
        visible={isOtpVisible}
        styles={styles}
        isRTL={isRTL}
        phone={phone}
        callingCode={callingCode}
        otp={otp}
        onOtpChange={setOtp}
        resendTimer={resendTimer}
        isVerifying={isLoading}
        isSending={isSending}
        translateY={translateY}
        backdropOpacity={backdropOpacity}
        onClose={() => {
          closeOtpAnim();
        }}
        onResend={resendOtp}
        onVerify={verifyOtp}
        error={isOtpVisible ? error : undefined}
      />
    </SafeAreaView>
  );
}
