import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Chip = { key: string; label: string };

type Props = {
  chips: Chip[];
  selected: string;
  onSelect: (key: string) => void;
};

export function FilterChipRow({ chips, selected, onSelect }: Props) {
  const { theme } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}>
      {chips.map(chip => {
        const active = chip.key === selected;
        return (
          <TouchableOpacity
            key={chip.key}
            onPress={() => onSelect(chip.key)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? BrandColors.brandDeep : theme.surface,
                borderColor: active ? BrandColors.brandDeep : theme.cardBorder,
              },
            ]}
            activeOpacity={0.8}>
            <Text style={[styles.chipText, { color: active ? Colors.white : theme.text }]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.trail} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    maxHeight: Layout.chipHeight + Spacing.xs,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingRight: Spacing.xs,
  },
  chip: {
    height: Layout.chipHeight,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
  },
  trail: { width: 4 },
});
