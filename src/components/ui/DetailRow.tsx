import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
  onPress?: () => void;
};

export function DetailRow({ icon, label, value, last, onPress }: Props) {
  const { theme } = useAppTheme();

  const content = (
    <>
      <View style={styles.iconBox}>
        <AppIcon name={icon} size={14} color={BrandColors.accentOrange} solid />
      </View>
      <View style={styles.body}>
        <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
        <Text
          style={[styles.value, { color: onPress ? BrandColors.accentOrange : theme.text }]}
          numberOfLines={3}>
          {value}
        </Text>
      </View>
      {onPress ? (
        <AppIcon name="chevron-right" size={12} color={theme.textSecondary} solid />
      ) : null}
    </>
  );

  const rowStyle = [
    styles.row,
    !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.cardBorder },
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={rowStyle} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(240, 137, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  body: { flex: 1, minWidth: 0 },
  label: {
    fontFamily: APP_FONTS.regular,
    fontSize: 11,
    lineHeight: 14,
  },
  value: {
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 1,
  },
});
