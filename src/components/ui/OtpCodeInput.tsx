import React, { useMemo } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { OtpInput, type Theme as OtpTheme } from 'react-native-otp-entry';
import { APP_FONTS } from '@constants/appFonts';
import { BrandColors } from '@constants/colors';
import { addAlpha } from '@theme/index';
import { useAppTheme } from '@theme/useAppTheme';

type Props = {
  length?: number;
  onChange: (text: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  blurOnFilled?: boolean;
  parentPadding?: number;
};

const BOX_GAP = 10;
const MAX_BOX = 46;
const MIN_BOX = 38;

export function OtpCodeInput({
  length = 6,
  onChange,
  disabled,
  autoFocus = false,
  blurOnFilled,
  parentPadding = 24,
}: Props) {
  const { theme } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();

  const boxSize = useMemo(() => {
    const contentWidth = screenWidth - parentPadding * 2;
    const totalGap = BOX_GAP * (length - 1);
    return Math.min(MAX_BOX, Math.max(MIN_BOX, Math.floor((contentWidth - totalGap) / length)));
  }, [screenWidth, length, parentPadding]);

  // Exact pixel width so the library container NEVER shifts
  const rowWidth = boxSize * length + BOX_GAP * (length - 1);

  const otpTheme = useMemo<OtpTheme>(
    () => ({
      // Override the library's default "width:100% + space-between"
      containerStyle: {
        width: rowWidth,
        flexDirection: 'row' as const,
        justifyContent: 'flex-start' as const, // we rely on fixed width, not justify
        alignItems: 'center' as const,
        gap: BOX_GAP,
      },
      pinCodeContainerStyle: {
        width: boxSize,
        height: boxSize,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: addAlpha(BrandColors.accentOrange, 0.28),
        backgroundColor: theme.name === 'dark' ? theme.elevatedSurface : theme.background,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        overflow: 'hidden' as const,
        // Lock size — prevents any reflow when focused/filled state changes
        minWidth: boxSize,
        maxWidth: boxSize,
        minHeight: boxSize,
        maxHeight: boxSize,
      },
      pinCodeTextStyle: {
        width: boxSize - 4,
        fontSize: boxSize >= 44 ? 20 : 18,
        fontFamily: APP_FONTS.bold,
        color: theme.text,
        textAlign: 'center' as const,
        lineHeight: Platform.OS === 'ios' ? boxSize - 4 : undefined,
        padding: 0,
        margin: 0,
        ...(Platform.OS === 'android'
          ? { includeFontPadding: false, textAlignVertical: 'center' as const }
          : {}),
      },
      focusStickStyle: {
        backgroundColor: BrandColors.accentOrange,
        width: 2,
        height: Math.round(boxSize * 0.45),
      },
      focusedPinCodeContainerStyle: {
        borderColor: BrandColors.accentOrange,
        borderWidth: 2,
      },
      filledPinCodeContainerStyle: {
        borderColor: addAlpha(BrandColors.accentOrange, 0.55),
        backgroundColor: theme.name === 'dark'
          ? theme.elevatedSurface
          : addAlpha(BrandColors.accentOrange, 0.06),
      },
    }),
    [boxSize, rowWidth, theme],
  );

  return (
    // Outer View fixes the container at exactly rowWidth — library cannot overflow
    <View style={[styles.wrap, { width: rowWidth }]}>
      <OtpInput
        numberOfDigits={length}
        type="numeric"
        autoFocus={autoFocus}
        blurOnFilled={blurOnFilled}
        disabled={disabled}
        hideStick={false}
        onTextChange={onChange}
        theme={otpTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    marginVertical: 12,
    overflow: 'hidden',
  },
});
