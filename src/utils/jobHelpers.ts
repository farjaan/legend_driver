import { BrandColors, Colors } from '@constants/colors';
import type { JobPriority, JobStatus, JobType } from '@domain/job.types';

export function priorityColor(priority: JobPriority): string {
  switch (priority) {
    case 'urgent':
      return Colors.danger;
    case 'overdue_return':
      return Colors.warning;
    case 'same_day':
      return BrandColors.accentOrange;
    default:
      return BrandColors.brandSecondary;
  }
}

export function jobTypeLabel(type: JobType): string {
  const map: Record<JobType, string> = {
    delivery: 'Delivery',
    pickup: 'Pickup',
    return_collection: 'Return',
    chauffeur: 'Chauffeur',
  };
  return map[type];
}

export function nextStatus(current: JobStatus): JobStatus | null {
  const flow: JobStatus[] = [
    'assigned',
    'accepted',
    'en_route',
    'arrived',
    'handover_in_progress',
    'completed',
  ];
  const idx = flow.indexOf(current);
  if (idx < 0 || idx >= flow.length - 1) return null;
  return flow[idx + 1];
}
