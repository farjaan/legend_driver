export type TripStopType = 'pickup' | 'stop' | 'destination' | 'drop';

export type ChauffeurTripPhase =
  | 'pending'
  | 'navigating'
  | 'arrived'
  | 'in_progress'
  | 'completed';

export interface TripStop {
  id: string;
  type: TripStopType;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  completed: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface ChauffeurTrip {
  trip_id: string;
  job_id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone_masked: string;
  vehicle_label: string;
  scheduled_at: string;
  emergency_contact: EmergencyContact;
  phase: ChauffeurTripPhase;
  started_at: string | null;
  ended_at: string | null;
  arrived_at: string | null;
  elapsed_seconds: number;
  distance_km: number;
  stops: TripStop[];
  policy_note: string;
}

export interface ChauffeurTripSummary {
  trip: ChauffeurTrip;
  stops_completed: number;
}
