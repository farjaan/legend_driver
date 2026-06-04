import { useMemo } from 'react';
import { createCardStyles } from '@components/ui/cardStyles';
import { useAppTheme } from '@theme/useAppTheme';

export function useCardStyles() {
  const { theme } = useAppTheme();
  return useMemo(() => createCardStyles(theme), [theme]);
}
