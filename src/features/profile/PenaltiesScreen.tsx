import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { EmptyState } from '@components/EmptyState';
import { StatusPill } from '@components/ui/StatusPill';
import { useCardStyles } from '@hooks/useCardStyles';
import { profileService } from '@api/services/profileService';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import type { PenaltyRecord } from '@api/models/profile.models';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Penalties'>;

export function PenaltiesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const cardStyles = useCardStyles();
  const [penalties, setPenalties] = useState<PenaltyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void profileService.fetchPenalties().then(data => {
      setPenalties(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <ScreenScaffold
      title={t('profile.penalties')}
      subtitle={t('profile.penaltiesSub')}
      onBack={() => navigation.goBack()}
      loading={isLoading}>
      {penalties.length === 0 ? (
        <EmptyState title={t('profile.penaltiesEmpty')} icon="check-circle" />
      ) : (
        penalties.map(p => (
          <View key={p.id} style={cardStyles.card}>
            <View style={styles.top}>
              <StatusPill label={p.type.replace('_', ' ')} tone="warning" />
              <Text style={cardStyles.meta}>{p.date}</Text>
            </View>
            <Text style={cardStyles.title}>{p.booking_reference}</Text>
            <Text style={styles.amount}>
              {p.amount_aed > 0 ? `AED ${p.amount_aed}` : p.note ?? '—'}
            </Text>
          </View>
        ))
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  amount: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    color: BrandColors.brandDeep,
    lineHeight: 20,
    marginTop: 4,
  },
});
