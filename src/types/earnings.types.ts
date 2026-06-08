export interface EarningsPeriod {
  amount_aed: number;
  trips: number;
}

export interface EarningsSummary {
  today: EarningsPeriod;
  week: EarningsPeriod;
  month: EarningsPeriod;
}

export interface EarningsRecord {
  id: string;
  booking_reference: string;
  amount_aed: number;
  trip_date: string;
  job_type: string;
  customer_name: string;
}
