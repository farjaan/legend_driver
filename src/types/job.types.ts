export type JobType = 'delivery' | 'pickup' | 'return_collection' | 'chauffeur';

export type JobPriority = 'urgent' | 'overdue_return' | 'same_day' | 'normal';

export type JobStatus =
  | 'assigned'
  | 'accepted'
  | 'rejected'
  | 'en_route'
  | 'arrived'
  | 'handover_in_progress'
  | 'completed'
  | 'cancelled';

export type RejectReason = 'busy' | 'traffic' | 'vehicle_issue' | 'other';

export type DeliveryStatus = 'self_pickup' | 'paid_delivery';

export interface JobVehicle {
  make: string;
  model: string;
  year: number;
  plate_number: string;
  color: string;
  /** Local bundled asset (require) */
  image?: number;
  /** Remote URL from API — preferred for network tests */
  image_uri?: string;
}

export interface DriverJob {
  job_id: string;
  job_type: JobType;
  priority: JobPriority;
  job_status: JobStatus;
  booking_id: number;
  booking_reference: string;
  customer_name: string;
  customer_phone_masked: string;
  vehicle: JobVehicle;
  branch_name: string;
  scheduled_at: string;
  pick_up_address?: string;
  drop_off_address?: string;
  latitude: number;
  longitude: number;
  delivery_status?: DeliveryStatus;
  notes?: string;
  collection_form_summary?: string;
}
