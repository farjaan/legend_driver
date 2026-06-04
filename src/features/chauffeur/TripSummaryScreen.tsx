import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { SectionCard } from '@components/ui/SectionCard';
import { DetailRow } from '@components/ui/DetailRow';
import { PrimaryButton } from '@components/ui/PrimaryButton';
import { AppIcon } from '@components/icons';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { formatElapsed } from '@utils/format';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TripSummary'>;

export function TripSummaryScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { jobId } = route.params;

  const distanceKm = 12.4;
  const elapsedSeconds = 5220;
  const stopsCompleted = 2;
  const bookingRef = `LGC-2026-${jobId.slice(-5)}`;

  return (
    <ScreenScaffold
      title={t('chauffeur.tripSummaryTitle')}
      subtitle={bookingRef}
      onBack={() => navigation.goBack()}>

      {/* Completion banner */}
      <View style={[styles.banner, { backgroundColor: BrandColors.brandDeep }]}>
        <View style={styles.bannerIcon}>
          <AppIcon name="flag-checkered" size={28} color={BrandColors.accentOrange} solid />
        </View>
        <Text style={styles.bannerTitle}>{t('chauffeur.tripComplete')}</Text>
        <Text style={styles.bannerSub}>{bookingRef}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <AppIcon name="route" size={16} color={BrandColors.accentOrange} solid />
          <Text style={[styles.statValue, { color: theme.text }]}>{distanceKm.toFixed(1)} km</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('chauffeur.totalDistance')}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <AppIcon name="clock" size={16} color={BrandColors.accentOrange} solid />
          <Text style={[styles.statValue, { color: theme.text }]}>{formatElapsed(elapsedSeconds)}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('chauffeur.totalDuration')}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <AppIcon name="map-marker-alt" size={16} color={BrandColors.accentOrange} solid />
          <Text style={[styles.statValue, { color: theme.text }]}>{stopsCompleted}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('chauffeur.stopsCompleted')}</Text>
        </View>
      </View>

      <SectionCard title={t('chauffeur.stops')}>
        <DetailRow icon="map-marker-alt" label="Stop 1" value="Dubai Marina — Pick-up" />
        <DetailRow icon="map-marker-alt" label="Stop 2" value="Downtown Dubai — Drop" last />
      </SectionCard>

      <PrimaryButton
        label={t('chauffeur.closeSummary')}
        onPress={() => navigation.popToTop()}
        style={styles.doneBtn}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Layout.cardRadius,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(240,137,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  bannerTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 20,
    color: Colors.white,
    lineHeight: 24,
  },
  bannerSub: {
    fontFamily: APP_FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    flex: 1,
    borderRadius: Layout.cardRadius,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    lineHeight: 18,
  },
  statLabel: {
    fontFamily: APP_FONTS.regular,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
  doneBtn: {
    marginBottom: Spacing.xl,
  },
});
