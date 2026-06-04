import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpCodeInput } from '@components/ui/OtpCodeInput';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { AppIcon } from '@components/icons';
import { SectionCard } from '@components/ui/SectionCard';
import { FormField } from '@components/ui/FormField';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { HANDOVER_QR_PREFIX } from '@config/env';
import { handoverService } from '@api/services/handoverService';
import { useJobStore } from '@store/jobStore';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HandoverVerify'>;
type Tab = 'otp' | 'qr';

const OTP_LEN = 6;

export function HandoverVerifyScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const job = useJobStore(s => s.getJob(route.params.jobId));
  const [tab, setTab] = useState<Tab>('otp');
  const [otp, setOtp] = useState('');
  const [qrPayload, setQrPayload] = useState(`${HANDOVER_QR_PREFIX}${job?.booking_id ?? ''}`);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useAppTheme();

  const verifyOtp = async () => {
    if (!job) return;
    setLoading(true);
    const res = await handoverService.verifyOtp(job.booking_id, otp);
    setMessage(res.message);
    setLoading(false);
    if (res.success) navigation.goBack();
  };

  const verifyQr = async () => {
    setLoading(true);
    const res = await handoverService.verifyQr(qrPayload);
    setMessage(res.success ? t('verify.qrSuccess') : t('verify.qrFailed'));
    setLoading(false);
    if (res.success) navigation.goBack();
  };

  return (
    <ScreenScaffold
      title={t('verify.title')}
      subtitle={job?.booking_reference}
      onBack={() => navigation.goBack()}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: tab === 'otp' ? BrandColors.brandDeep : theme.surface,
              borderColor: tab === 'otp' ? BrandColors.brandDeep : theme.cardBorder,
            },
          ]}
          onPress={() => setTab('otp')}>
          <AppIcon
            name="key"
            size={14}
            color={tab === 'otp' ? Colors.white : theme.text}
            solid={tab === 'otp'}
          />
          <Text
            style={[
              styles.tabText,
              { color: tab === 'otp' ? Colors.white : theme.text },
            ]}>
            {t('verify.otp')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: tab === 'qr' ? BrandColors.brandDeep : theme.surface,
              borderColor: tab === 'qr' ? BrandColors.brandDeep : theme.cardBorder,
            },
          ]}
          onPress={() => setTab('qr')}>
          <AppIcon
            name="qrcode"
            size={14}
            color={tab === 'qr' ? Colors.white : theme.text}
            solid={tab === 'qr'}
          />
          <Text
            style={[
              styles.tabText,
              { color: tab === 'qr' ? Colors.white : theme.text },
            ]}>
            {t('verify.qr')}
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'otp' ? (
        <SectionCard>
          <View style={styles.iconHero}>
            <AppIcon name="shield-alt" size={32} color={BrandColors.accentOrange} solid />
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('verify.otpTitle')}</Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>{t('verify.otpHint')}</Text>
          <OtpCodeInput autoFocus parentPadding={28} onChange={setOtp} />
          <PrimaryButton
            label={t('verify.verifyBtn')}
            onPress={verifyOtp}
            loading={loading}
            disabled={otp.length < OTP_LEN}
            style={styles.btn}
          />
        </SectionCard>
      ) : (
        <SectionCard>
          <View style={styles.iconHero}>
            <AppIcon name="qrcode" size={32} color={BrandColors.accentOrange} solid />
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('verify.qrTitle')}</Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>{t('verify.qrHint')}</Text>
          <FormField
            label={t('verify.qrPayload')}
            value={qrPayload}
            onChangeText={setQrPayload}
            autoCapitalize="characters"
          />
          <PrimaryButton
            label={t('verify.verifyBtn')}
            onPress={verifyQr}
            loading={loading}
            variant="outline"
            style={styles.btn}
          />
        </SectionCard>
      )}

      {message ? (
        <Text style={[styles.msg, message.includes('Invalid') && styles.msgError]}>
          {message}
        </Text>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 13,
  },
  iconHero: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(240, 137, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: Spacing.xs,
  },
  hint: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  btn: { marginTop: Spacing.md },
  msg: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: Colors.success,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  msgError: {
    color: Colors.danger,
  },
});
