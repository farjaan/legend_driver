export type KycStatus = 'pending' | 'approved' | 'rejected';

export interface FleetVehicle {
  vehicle_id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  color?: string;
}

export interface DriverDocumentStatus {
  driving_license: 'uploaded' | 'pending' | 'expired';
  national_id: 'uploaded' | 'pending' | 'expired';
  employee_id: 'uploaded' | 'pending' | 'expired';
  insurance: 'uploaded' | 'pending' | 'expired';
}

export interface DriverProfile {
  driver_id: string;
  employee_id: string;
  full_name: string;
  phone: string;
  email: string;
  license_number?: string;
  kyc_status: KycStatus;
  license_expiry: string;
  documents?: DriverDocumentStatus;
  fleet_vehicles: FleetVehicle[];
  rating_avg: number;
  is_online: boolean;
  avatar_uri?: string;
  avatar_source?: number;
}
