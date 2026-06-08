import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CENTER_FAB_TAB_BAR_OVERLAY_HEIGHT } from '@components/DriverCenterTabBar';

export function useTabBarInset(extra = 4) {
  const insets = useSafeAreaInsets();
  return CENTER_FAB_TAB_BAR_OVERLAY_HEIGHT + Math.max(insets.bottom, extra);
}
