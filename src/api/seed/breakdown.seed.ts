import type { BreakdownTicket } from '@domain/breakdown.types';

export const BREAKDOWN_TICKETS_SEED: BreakdownTicket[] = [
  {
    ticket_id: 'BD-501',
    booking_reference: 'LGC-2026-43100',
    customer_name: 'Khalid S.',
    issue_summary: 'Engine warning light — vehicle not starting',
    address: 'Sheikh Zayed Rd, near Exit 39',
    latitude: 25.118,
    longitude: 55.2003,
    status: 'assigned',
    assigned_at: '2026-05-26T10:15:00+04:00',
  },
  {
    ticket_id: 'BD-502',
    booking_reference: 'LGC-2026-42950',
    customer_name: 'Noura T.',
    issue_summary: 'Flat tire — requires roadside assist',
    address: 'Al Khail Rd, Business Bay',
    latitude: 25.1865,
    longitude: 55.2641,
    status: 'en_route',
    assigned_at: '2026-05-25T19:40:00+04:00',
  },
];
