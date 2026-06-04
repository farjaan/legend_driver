import type { BookingSummary } from '@api/models/booking.models';

export function buildBookingSummary(
  job: {
    booking_id: number;
    booking_reference: string;
    customer_name: string;
    customer_phone_masked: string;
    pick_up_address?: string;
    drop_off_address?: string;
    delivery_status?: string;
    scheduled_at: string;
    job_type: string;
  },
): BookingSummary {
  const date = job.scheduled_at.slice(0, 10);
  return {
    booking_id: job.booking_id,
    booking_reference: job.booking_reference,
    booking_status: 'BOOKING_CONFIRMED',
    booking_type:
      job.job_type === 'chauffeur' ? 'Book with Driver' : 'Daily/Weekly',
    customer_name: job.customer_name,
    customer_phone_masked: job.customer_phone_masked,
    pick_up_date: date,
    pick_up_time: '14:00',
    drop_off_date: date,
    drop_off_time: '18:00',
    total_days: 3,
    pick_up_address: job.pick_up_address ?? 'Legend Branch',
    drop_off_address: job.drop_off_address ?? 'Customer location',
    delivery_status: job.delivery_status,
    total_amount: '1,250.00',
    paid_amount: '625.00',
    due_amount: '625.00',
    payment_status: 'PARTIAL',
  };
}
