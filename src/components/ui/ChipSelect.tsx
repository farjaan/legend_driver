import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

export function ChipSelect({ options, value, onChange }: Props) {
  const { theme } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? BrandColors.brandDeep : theme.surface,
                borderColor: active ? BrandColors.brandDeep : theme.cardBorder,
              },
            ]}
            activeOpacity={0.85}>
            <Text
              style={[
                styles.text,
                { color: active ? Colors.white : theme.text },
              ]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
  },
});
