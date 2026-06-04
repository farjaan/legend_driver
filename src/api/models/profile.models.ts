export interface WeeklySummary {
  jobs_completed: number;
  on_time_pct: number;
  avg_rating: number;
  earnings_note: string;
}

export interface PenaltyRecord {
  id: string;
  type: 'late' | 'no_show' | 'incomplete_checklist';
  booking_reference: string;
  amount_aed: number;
  note?: string;
  date: string;
}

export interface RatingRecord {
  booking_reference: string;
  stars: number;
  comment: string;
  date: string;
}
