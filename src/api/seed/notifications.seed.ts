import type { DriverNotification } from '@domain/notification.types';

export const NOTIFICATIONS_SEED: DriverNotification[] = [
  {
    id: 'n1',
    type: 'new_job',
    title: 'New delivery assigned',
    body: 'LGC-2026-44821 — Marina to JBR',
    read: false,
    created_at: '2026-05-26T13:55:00+04:00',
    job_id: 'JOB-9001',
  },
  {
    id: 'n2',
    type: 'reschedule',
    title: 'Job rescheduled',
    body: 'LGC-2026-44102 moved to 16:30',
    read: false,
    created_at: '2026-05-26T12:10:00+04:00',
    job_id: 'JOB-9002',
  },
  {
    id: 'n3',
    type: 'cancel',
    title: 'Job cancelled',
    body: 'LGC-2026-43999 cancelled by dispatch',
    read: true,
    created_at: '2026-05-26T09:00:00+04:00',
  },
];
