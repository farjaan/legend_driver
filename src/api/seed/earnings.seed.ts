import type { EarningsRecord, EarningsSummary } from '@domain/earnings.types';

export const EARNINGS_SUMMARY_SEED: EarningsSummary = {
  today: { amount_aed: 285, trips: 3 },
  week: { amount_aed: 1840, trips: 18 },
  month: { amount_aed: 7420, trips: 72 },
};

export const EARNINGS_RECORDS_SEED: EarningsRecord[] = [
  {
    id: 'e1',
    booking_reference: 'LGC-2026-44990',
    amount_aed: 95,
    trip_date: '2026-05-26',
    job_type: 'delivery',
    customer_name: 'Layla M.',
  },
  {
    id: 'e2',
    booking_reference: 'LGC-2026-45001',
    amount_aed: 120,
    trip_date: '2026-05-26',
    job_type: 'chauffeur',
    customer_name: 'Fatima A.',
  },
  {
    id: 'e3',
    booking_reference: 'LGC-2026-44821',
    amount_aed: 70,
    trip_date: '2026-05-25',
    job_type: 'delivery',
    customer_name: 'Sara K.',
  },
  {
    id: 'e4',
    booking_reference: 'LGC-2026-44102',
    amount_aed: 85,
    trip_date: '2026-05-24',
    job_type: 'return_collection',
    customer_name: 'Omar H.',
  },
  {
    id: 'e5',
    booking_reference: 'LGC-2026-43001',
    amount_aed: 65,
    trip_date: '2026-05-23',
    job_type: 'pickup',
    customer_name: 'James R.',
  },
];
