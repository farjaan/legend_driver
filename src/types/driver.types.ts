export type KycStatus = 'pending' | 'approved' | 'rejected';

export interface FleetVehicle {
  vehicle_id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  color?: string;
}

export interface DriverProfile {
  driver_id: string;
  employee_id: string;
  full_name: string;
  phone: string;
  email: string;
  kyc_status: KycStatus;
  license_expiry: string;
  fleet_vehicles: FleetVehicle[];
  rating_avg: number;
  is_online: boolean;
  avatar_uri?: string;
  avatar_source?: number;
}
