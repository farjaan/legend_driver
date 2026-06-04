export type TripStopType = 'pickup' | 'stop' | 'destination' | 'drop';

export interface TripStop {
  id: string;
  type: TripStopType;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  completed: boolean;
}

export interface ChauffeurTrip {
  trip_id: string;
  job_id: string;
  booking_reference: string;
  started_at: string | null;
  ended_at: string | null;
  elapsed_seconds: number;
  distance_km: number;
  stops: TripStop[];
  policy_note: string;
}
