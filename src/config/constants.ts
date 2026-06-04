import type { FuelLevel } from '@domain/handover.types';
import type { RejectReason } from '@domain/job.types';

export const FUEL_LEVELS: FuelLevel[] = ['Empty', '1/4', '1/2', '3/4', 'Full'];

export const CHECKOUT_CHECKLIST_DEFAULT = [
  'Registration & insurance copy present',
  'Spare tire & toolkit',
  'Fuel cap / charging port',
  'Clean interior',
  'No warning lights on dashboard',
] as const;

export const REJECT_REASONS: { key: RejectReason; labelKey: string }[] = [
  { key: 'busy', labelKey: 'jobs.rejectReason.busy' },
  { key: 'traffic', labelKey: 'jobs.rejectReason.traffic' },
  { key: 'vehicle_issue', labelKey: 'jobs.rejectReason.vehicle' },
  { key: 'other', labelKey: 'jobs.rejectReason.other' },
];

export const JOB_STATUS_ORDER = [
  'assigned',
  'accepted',
  'en_route',
  'arrived',
  'handover_in_progress',
  'completed',
] as const;
