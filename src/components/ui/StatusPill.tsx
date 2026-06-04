import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';

type Tone = 'neutral' | 'active' | 'success' | 'warning';

type Props = {
  label: string;
  tone?: Tone;
};

const toneStyles: Record<Tone, { bg: string; text: string }> = {
  neutral: { bg: 'rgba(44, 27, 71, 0.08)', text: BrandColors.brandDeep },
  active: { bg: 'rgba(240, 137, 0, 0.15)', text: BrandColors.accentOrange },
  success: { bg: 'rgba(22, 163, 74, 0.12)', text: Colors.success },
  warning: { bg: 'rgba(217, 119, 6, 0.12)', text: Colors.warning },
};

export function StatusPill({ label, tone = 'neutral' }: Props) {
  const c = toneStyles[tone];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: APP_FONTS.bold,
    fontSize: 10,
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
});
