import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@components/icons';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';
import { addAlpha } from '@theme/index';

export type MenuItem = {
  id: string;
  label: string;
  icon: string;
  value?: string;
  tone?: 'default' | 'danger';
  onPress: () => void;
};

type Props = {
  title: string;
  items: MenuItem[];
};

export function MenuSection({ title, items }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      <View
        style={[
          styles.list,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
        ]}>
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.row,
              index < items.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.cardBorder,
              },
              pressed && { backgroundColor: addAlpha(BrandColors.brandPrimary, 0.06) },
            ]}>
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: addAlpha(
                    item.tone === 'danger' ? BrandColors.brandBurgundy : BrandColors.accentOrange,
                    0.12,
                  ),
                },
              ]}>
              <AppIcon
                name={item.icon}
                size={15}
                color={item.tone === 'danger' ? Colors.danger : BrandColors.accentOrange}
                solid
              />
            </View>
            <Text
              style={[
                styles.label,
                { color: item.tone === 'danger' ? Colors.danger : theme.text },
              ]}
              numberOfLines={1}>
              {item.label}
            </Text>
            {item.value ? (
              <Text style={[styles.value, { color: theme.textMuted }]}>{item.value}</Text>
            ) : null}
            <AppIcon name="chevron-right" size={12} color={theme.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: 2,
  },
  list: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: Spacing.md,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  label: {
    flex: 1,
    fontFamily: APP_FONTS.regular,
    fontSize: 14,
    lineHeight: 18,
  },
  value: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    marginRight: Spacing.sm,
  },
});
