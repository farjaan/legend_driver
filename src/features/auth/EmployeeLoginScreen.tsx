import React, { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/authStore';
import { loginScreenBackground } from '@constants/imageAssets';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { createAuthStyles } from '@features/auth/styles/authStyles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';
import { FormField } from '@components/ui/FormField';
import { PrimaryButton } from '@components/ui/PrimaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmployeeLogin'>;

const MOCK_EMPLOYEE_ID = 'EMP-1001';
const MOCK_PIN = '1234';

export function EmployeeLoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createAuthStyles(theme), [theme]);
  const loginWithOtp = useAuthStore(s => s.loginWithOtp);

  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canLogin = employeeId.trim().length >= 3 && pin.trim().length >= 4;

  const handleLogin = async () => {
    if (!canLogin) return;
    setError('');
    setLoading(true);
    await new Promise<void>(r => setTimeout(r, 800));
    if (
      employeeId.trim().toUpperCase() === MOCK_EMPLOYEE_ID &&
      pin.trim() === MOCK_PIN
    ) {
      await loginWithOtp('+971501234567', '123456');
    } else {
      setError(t('auth.employeeLoginFailed'));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.bg}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Image source={loginScreenBackground} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.overlay} />

        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.sheet}>
            {/* Switch to phone login */}
            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              style={switchStyles.switchRow}>
              <Text style={[switchStyles.switchText, { color: theme.textSecondary }]}>
                {t('auth.loginPhone')} →
              </Text>
            </TouchableOpacity>

            <Text style={styles.title}>{t('auth.loginEmployee')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              EMP-1001 / 1234
            </Text>

            <FormField
              label={t('auth.employeeId')}
              value={employeeId}
              onChangeText={v => {
                setEmployeeId(v);
                setError('');
              }}
              placeholder={t('auth.employeeIdPlaceholder')}
              autoCapitalize="characters"
            />

            <FormField
              label={t('auth.pin')}
              value={pin}
              onChangeText={v => {
                setPin(v);
                setError('');
              }}
              placeholder={t('auth.pinPlaceholder')}
              keyboardType="number-pad"
              secureTextEntry
            />

            {error ? (
              <Text style={[switchStyles.error, { color: BrandColors.accentOrange }]}>
                {error}
              </Text>
            ) : null}

            <PrimaryButton
              label={t('common.continue')}
              onPress={handleLogin}
              loading={loading}
              disabled={!canLogin}
              style={switchStyles.btn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const switchStyles = {
  switchRow: {
    alignSelf: 'flex-end' as const,
    marginBottom: Spacing.sm,
  },
  switchText: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
  },
  error: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    marginBottom: Spacing.sm,
    textAlign: 'center' as const,
  },
  btn: {
    marginTop: Spacing.sm,
  },
};
