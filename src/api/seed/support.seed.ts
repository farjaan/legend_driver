import type { SupportTicket } from '@domain/support.types';

export const SUPPORT_TICKETS_SEED: SupportTicket[] = [
  {
    ticket_id: 'ST-1001',
    ticket_number: 'TKT-2026-1001',
    category: 'vehicle',
    priority: 'high',
    status: 'open',
    subject: 'Vehicle engine warning light',
    description: 'Vehicle showing engine warning after trip.',
    created_at: '2026-05-26T09:15:00+04:00',
    location: 'Dubai Marina',
    messages: [
      {
        id: 'm1',
        sender: 'driver',
        body: 'Vehicle showing engine warning after trip.',
        sent_at: '2026-05-26T09:15:00+04:00',
      },
    ],
  },
  {
    ticket_id: 'ST-1002',
    ticket_number: 'TKT-2026-1002',
    category: 'app',
    priority: 'medium',
    status: 'in_progress',
    subject: 'Map not loading on job detail',
    description: 'Google map preview shows blank on Android device.',
    created_at: '2026-05-25T14:30:00+04:00',
    messages: [
      {
        id: 'm2',
        sender: 'driver',
        body: 'Google map preview shows blank on Android device.',
        sent_at: '2026-05-25T14:30:00+04:00',
      },
      {
        id: 'm3',
        sender: 'admin',
        body: 'Thanks for reporting. Our team is investigating the Maps SDK configuration.',
        sent_at: '2026-05-25T15:00:00+04:00',
      },
    ],
  },
  {
    ticket_id: 'ST-1003',
    ticket_number: 'TKT-2026-1003',
    category: 'booking',
    priority: 'low',
    status: 'closed',
    subject: 'Wrong pickup address on booking',
    description: 'Customer address was updated but job still shows old location.',
    created_at: '2026-05-20T11:00:00+04:00',
    messages: [
      {
        id: 'm4',
        sender: 'driver',
        body: 'Customer address was updated but job still shows old location.',
        sent_at: '2026-05-20T11:00:00+04:00',
      },
      {
        id: 'm5',
        sender: 'admin',
        body: 'Address corrected in system. Please refresh your job list.',
        sent_at: '2026-05-20T11:45:00+04:00',
      },
      {
        id: 'm6',
        sender: 'driver',
        body: 'Confirmed — address is correct now. Thank you.',
        sent_at: '2026-05-20T12:00:00+04:00',
      },
    ],
  },
];
