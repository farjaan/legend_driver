import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_OVERLAY_HEIGHT } from '@components/DriverTabBar';

export function useTabBarInset(extra = 4) {
  const insets = useSafeAreaInsets();
  return TAB_BAR_OVERLAY_HEIGHT + Math.max(insets.bottom, extra);
}
