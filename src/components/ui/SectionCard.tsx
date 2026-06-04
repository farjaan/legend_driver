import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '@theme/useAppTheme';
import { useCardStyles } from '@hooks/useCardStyles';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';

type Props = {
  title?: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: Props) {
  const { theme } = useAppTheme();
  const cardStyles = useCardStyles();

  return (
    <View style={cardStyles.card}>
      {title ? (
        <Text
          style={{
            fontFamily: APP_FONTS.bold,
            fontSize: 14,
            color: theme.text,
            lineHeight: 18,
            marginBottom: Spacing.sm,
          }}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
