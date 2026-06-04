import dayjs from 'dayjs';

export function formatJobSchedule(iso: string): string {
  return dayjs(iso).format('DD MMM YYYY, HH:mm');
}

export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function maskPhoneDisplay(masked: string): string {
  return masked;
}
