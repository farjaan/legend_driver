import { Platform } from 'react-native';

export const TAB_BAR_FAB_SIZE = 56;

/** Space to reserve above the home indicator (notch FAB + labels). */
export const CENTER_FAB_TAB_BAR_OVERLAY_HEIGHT = Platform.OS === 'ios' ? 92 : 82;
