import { VEHICLE_IMAGE_BY_KEY, type VehicleImageKey } from '@assets/placeholders';
import type { DriverJob, JobVehicle } from '@domain/job.types';
import type { DriverJobDto } from '@api/models/job.models';

function mapVehicle(dto: DriverJobDto['vehicle']): JobVehicle {
  const imageKey = dto.image_key as VehicleImageKey | undefined;
  return {
    make: dto.make,
    model: dto.model,
    year: dto.year,
    plate_number: dto.plate_number,
    color: dto.color,
    image_uri: dto.image_url,
    image: !dto.image_url && imageKey ? VEHICLE_IMAGE_BY_KEY[imageKey] : undefined,
  };
}

export function mapJobDtoToDriverJob(dto: DriverJobDto): DriverJob {
  return {
    job_id: dto.job_id,
    job_type: dto.job_type,
    priority: dto.priority,
    job_status: dto.job_status,
    booking_id: dto.booking_id,
    booking_reference: dto.booking_reference,
    customer_name: dto.customer_name,
    customer_phone_masked: dto.customer_phone_masked,
    vehicle: mapVehicle(dto.vehicle),
    branch_name: dto.branch_name,
    scheduled_at: dto.scheduled_at,
    pick_up_address: dto.pick_up_address,
    drop_off_address: dto.drop_off_address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    delivery_status: dto.delivery_status,
    notes: dto.notes,
    collection_form_summary: dto.collection_form_summary,
  };
}

export function mapJobListDto(items: DriverJobDto[]): DriverJob[] {
  return items.map(mapJobDtoToDriverJob);
}
