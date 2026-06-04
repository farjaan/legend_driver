import { Platform } from 'react-native';

/** Flat tab bar content height (excludes safe area). */
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 58 : 54;

export const TAB_BAR_OVERLAY_HEIGHT = Platform.OS === 'ios' ? 78 : 72;
