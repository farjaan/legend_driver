import type { PenaltyRecord, RatingRecord, WeeklySummary } from '@api/models/profile.models';

export const WEEKLY_SUMMARY_SEED: WeeklySummary = {
  jobs_completed: 18,
  on_time_pct: 94,
  avg_rating: 4.7,
  earnings_note: 'Payout calculated by admin.',
};

export const PENALTIES_SEED: PenaltyRecord[] = [
  {
    id: 'p1',
    type: 'late',
    booking_reference: 'LGC-2026-43001',
    amount_aed: 50,
    date: '2026-05-20',
  },
  {
    id: 'p2',
    type: 'incomplete_checklist',
    booking_reference: 'LGC-2026-42888',
    amount_aed: 0,
    note: 'Warning only',
    date: '2026-05-18',
  },
];

export const RATINGS_SEED: RatingRecord[] = [
  {
    booking_reference: 'LGC-2026-44500',
    stars: 5,
    comment: 'Professional and on time.',
    date: '2026-05-24',
  },
  {
    booking_reference: 'LGC-2026-44220',
    stars: 4,
    comment: 'Smooth handover.',
    date: '2026-05-22',
  },
];
