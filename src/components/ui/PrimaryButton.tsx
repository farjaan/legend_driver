import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BrandColors, Colors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}: Props) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isOutline && styles.outline,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline ? BrandColors.brandDeep : Colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline && styles.textOutline,
            isDanger && styles.textDanger,
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: BrandColors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: BrandColors.accentOrange,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.88 },
  text: {
    fontFamily: APP_FONTS.bold,
    fontSize: 15,
    color: Colors.white,
    lineHeight: 20,
  },
  textOutline: {
    color: BrandColors.accentOrange,
  },
  textDanger: {
    color: Colors.danger,
  },
});
