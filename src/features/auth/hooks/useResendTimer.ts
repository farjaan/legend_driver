import { useEffect } from 'react';

export function useResendTimer(
  seconds: number,
  isActive: boolean,
  onTick: (next: number) => void,
) {
  useEffect(() => {
    if (!isActive || seconds <= 0) return;
    const id = setInterval(() => onTick(seconds - 1), 1000);
    return () => clearInterval(id);
  }, [seconds, isActive, onTick]);
}
