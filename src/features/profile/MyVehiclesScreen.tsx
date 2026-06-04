import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { AppIcon } from '@components/icons';
import { useAuthStore } from '@store/authStore';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import type { ThemeTokens } from '@theme/index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyVehicles'>;

export function MyVehiclesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vehicles = useAuthStore(s => s.profile?.fleet_vehicles ?? []);

  return (
    <ScreenScaffold
      title={t('profile.myVehicles')}
      subtitle={t('profile.myVehiclesSub')}
      onBack={() => navigation.goBack()}>
      {vehicles.length === 0 ? (
        <Text style={styles.empty}>{t('profile.noVehicles')}</Text>
      ) : (
        vehicles.map(v => (
          <View key={v.vehicle_id} style={styles.card}>
            <View style={styles.icon}>
              <AppIcon name="car" size={18} color={BrandColors.accentOrange} solid />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>
                {v.make} {v.model} ({v.year})
              </Text>
              <Text style={styles.plate}>{v.plate_number}</Text>
              {v.color ? <Text style={styles.meta}>{v.color}</Text> : null}
            </View>
          </View>
        ))
      )}
    </ScreenScaffold>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    empty: {
      fontFamily: APP_FONTS.regular,
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingVertical: Spacing.xl,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: Layout.cardRadius,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: Spacing.sm,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: 'rgba(240, 137, 0, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    info: { flex: 1 },
    title: {
      fontFamily: APP_FONTS.bold,
      fontSize: 15,
      color: theme.text,
      lineHeight: 20,
    },
    plate: {
      fontFamily: APP_FONTS.bold,
      fontSize: 13,
      color: BrandColors.accentOrange,
      marginTop: 2,
    },
    meta: {
      fontFamily: APP_FONTS.regular,
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });
}
