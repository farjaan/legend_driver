import type { DeliveryStatus, JobPriority, JobStatus, JobType } from '@domain/job.types';

export interface JobVehicleDto {
  make: string;
  model: string;
  year: number;
  plate_number: string;
  color: string;
  image_key?: string;
  image_url?: string;
}

export interface DriverJobDto {
  job_id: string;
  job_type: JobType;
  priority: JobPriority;
  job_status: JobStatus;
  booking_id: number;
  booking_reference: string;
  customer_name: string;
  customer_phone_masked: string;
  vehicle: JobVehicleDto;
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

export interface FetchJobListResponse {
  jobs: DriverJobDto[];
}

export interface AcceptJobRequest {
  job_id: string;
}

export interface RejectJobRequest {
  job_id: string;
  reason: string;
}

export interface UpdateJobStatusRequest {
  job_id: string;
  job_status: JobStatus;
}
