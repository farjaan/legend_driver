import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  icon: string;
  label: string;
  onPress: () => void;
  accent?: boolean;
};

export function ActionTile({ icon, label, onPress, accent }: Props) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        accent
          ? { backgroundColor: BrandColors.brandDeep, borderColor: BrandColors.brandDeep }
          : { backgroundColor: theme.surface, borderColor: theme.cardBorder },
        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.iconWrap,
          accent && styles.iconWrapAccent,
        ]}>
        <AppIcon
          name={icon}
          size={18}
          color={accent ? '#fff' : BrandColors.accentOrange}
          solid={accent}
        />
      </View>
      <Text
        style={[styles.label, accent && styles.labelAccent, !accent && { color: theme.text }]}
        numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: '46%',
    borderRadius: Layout.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  pressed: { opacity: 0.9 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(240, 137, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconWrapAccent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  label: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  labelAccent: {
    color: '#fff',
  },
});
