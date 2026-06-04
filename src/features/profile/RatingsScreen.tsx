import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenScaffold } from '@components/ScreenScaffold';
import { EmptyState } from '@components/EmptyState';
import { useCardStyles } from '@hooks/useCardStyles';
import { profileService } from '@api/services/profileService';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import type { RatingRecord } from '@api/models/profile.models';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Ratings'>;

export function RatingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const cardStyles = useCardStyles();
  const [ratings, setRatings] = useState<RatingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void profileService.fetchRatings().then(data => {
      setRatings(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <ScreenScaffold
      title={t('profile.ratings')}
      subtitle={t('profile.ratingsSub')}
      onBack={() => navigation.goBack()}
      loading={isLoading}>
      {ratings.length === 0 ? (
        <EmptyState title={t('profile.ratingsEmpty')} icon="star" />
      ) : (
        ratings.map(r => (
          <View key={r.booking_reference} style={cardStyles.card}>
            <View style={styles.top}>
              <Text style={styles.stars}>{'★'.repeat(r.stars)}</Text>
              <Text style={cardStyles.meta}>{r.date}</Text>
            </View>
            <Text style={cardStyles.title}>{r.booking_reference}</Text>
            <Text style={cardStyles.subtitle}>{r.comment}</Text>
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
    marginBottom: 4,
  },
  stars: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    color: BrandColors.accentOrange,
    lineHeight: 18,
  },
});
