import type { DriverJobDto } from './job.models';

export interface BookingSummary {
  booking_id: number;
  booking_reference: string;
  booking_status: string;
  booking_type: string;
  customer_name: string;
  customer_phone_masked: string;
  pick_up_date: string;
  pick_up_time: string;
  drop_off_date: string;
  drop_off_time: string;
  total_days: number;
  pick_up_address: string;
  drop_off_address: string;
  delivery_status?: string;
  total_amount: string;
  paid_amount: string;
  due_amount: string;
  payment_status: string;
}

export interface JobDetailResponse {
  job: DriverJobDto | null;
  booking: BookingSummary | null;
}
