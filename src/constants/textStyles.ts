import type { TextStyle } from 'react-native';
import { Colors } from './colors';
import { APP_FONTS } from './appFonts';

export const TextStyles = {
  h1: {
    fontFamily: APP_FONTS.bold,
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: Colors.brandDeep,
    lineHeight: 40,
  } as TextStyle,
  h2: {
    fontFamily: APP_FONTS.bold,
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: Colors.brandDeep,
    lineHeight: 36,
  } as TextStyle,
  h3: {
    fontFamily: APP_FONTS.bold,
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: Colors.brandDeep,
    lineHeight: 32,
  } as TextStyle,
  body: {
    fontFamily: APP_FONTS.regular,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: Colors.text,
    lineHeight: 24,
  } as TextStyle,
  bodySmall: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: Colors.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  button: {
    fontFamily: APP_FONTS.bold,
    fontSize: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: Colors.brandWhite,
    lineHeight: 24,
  } as TextStyle,
  label: {
    fontFamily: APP_FONTS.bold,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: Colors.brandDeep,
    lineHeight: 20,
  } as TextStyle,
};
