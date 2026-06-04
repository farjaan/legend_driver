import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { APP_FONTS } from '@constants/appFonts';
import { Layout, Spacing } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type Props = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...rest }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            borderColor: theme.cardBorder,
            backgroundColor: theme.screenBackground,
            color: theme.text,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: APP_FONTS.bold,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontFamily: APP_FONTS.regular,
    fontSize: 15,
  },
});
