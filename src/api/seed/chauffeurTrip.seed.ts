import type { ChauffeurTrip, ChauffeurTripPhase } from '@domain/chauffeur.types';
import type { DriverJobDto } from '@api/models/job.models';
import type { JobStatus } from '@domain/job.types';

const DISPATCH_EMERGENCY = {
  name: 'Legend Dispatch',
  phone: '+971800534363',
};

export function jobStatusToPhase(status: JobStatus): ChauffeurTripPhase {
  switch (status) {
    case 'assigned':
      return 'pending';
    case 'accepted':
    case 'en_route':
      return 'navigating';
    case 'arrived':
      return 'arrived';
    case 'handover_in_progress':
      return 'in_progress';
    case 'completed':
      return 'completed';
    default:
      return 'pending';
  }
}

export function buildChauffeurTripFromJob(
  job: DriverJobDto,
  existing?: Partial<ChauffeurTrip>,
): ChauffeurTrip {
  const pickupLat = job.latitude;
  const pickupLng = job.longitude;
  const dropLat = job.latitude + 0.018;
  const dropLng = job.longitude + 0.022;

  const stops = existing?.stops ?? [
    {
      id: 'pickup',
      type: 'pickup' as const,
      label: 'Pickup',
      address: job.pick_up_address ?? 'Pickup location',
      latitude: pickupLat,
      longitude: pickupLng,
      completed: Boolean(existing?.arrived_at),
    },
    {
      id: 'drop',
      type: 'drop' as const,
      label: 'Drop-off',
      address: job.drop_off_address ?? 'Drop-off location',
      latitude: dropLat,
      longitude: dropLng,
      completed: Boolean(existing?.ended_at),
    },
  ];

  return {
    trip_id: existing?.trip_id ?? `TRIP-${job.job_id}`,
    job_id: job.job_id,
    booking_reference: job.booking_reference,
    customer_name: job.customer_name,
    customer_phone_masked: job.customer_phone_masked,
    vehicle_label: `${job.vehicle.make} ${job.vehicle.model} · ${job.vehicle.plate_number}`,
    scheduled_at: job.scheduled_at,
    emergency_contact: DISPATCH_EMERGENCY,
    phase: jobStatusToPhase(job.job_status),
    started_at: existing?.started_at ?? null,
    ended_at: existing?.ended_at ?? null,
    arrived_at: existing?.arrived_at ?? null,
    elapsed_seconds: existing?.elapsed_seconds ?? 0,
    distance_km: existing?.distance_km ?? 0,
    policy_note: 'Company chauffeur ride — customer must not self-drive this vehicle.',
    stops,
  };
}

/** Default seed for JOB-9003 demo */
export const CHAUFFEUR_TRIP_SEED: ChauffeurTrip = {
  trip_id: 'TRIP-3001',
  job_id: 'JOB-9003',
  booking_reference: 'LGC-2026-45001',
  customer_name: 'Fatima A.',
  customer_phone_masked: '+971 52 *** **01',
  vehicle_label: 'Mercedes-Benz E-Class · L 10001',
  scheduled_at: '2026-05-26T18:00:00+04:00',
  emergency_contact: DISPATCH_EMERGENCY,
  phase: 'navigating',
  started_at: null,
  ended_at: null,
  arrived_at: null,
  elapsed_seconds: 0,
  distance_km: 0,
  policy_note: 'Company chauffeur ride — customer must not self-drive this vehicle.',
  stops: [
    {
      id: 's1',
      type: 'pickup',
      label: 'Pickup',
      address: 'DIFC Gate Avenue, Dubai',
      latitude: 25.211,
      longitude: 55.2814,
      completed: false,
    },
    {
      id: 's2',
      type: 'stop',
      label: 'Stop 1',
      address: 'City Walk, Dubai',
      latitude: 25.2048,
      longitude: 55.2603,
      completed: false,
    },
    {
      id: 's3',
      type: 'destination',
      label: 'Destination',
      address: 'Dubai Mall, Downtown',
      latitude: 25.1972,
      longitude: 55.2796,
      completed: false,
    },
    {
      id: 's4',
      type: 'drop',
      label: 'Drop-off',
      address: 'Dubai Mall, Fountain Views',
      latitude: 25.1963,
      longitude: 55.2744,
      completed: false,
    },
  ],
};
