import type { DriverProfile } from '@domain/driver.types';
import { DRIVER_AVATAR_URL } from './vehicleImages';

export const DRIVER_PROFILE_SEED: DriverProfile = {
  driver_id: 'DRV-2048',
  employee_id: 'EMP-1001',
  full_name: 'Ahmed Al Mansoori',
  phone: '+971501234567',
  email: 'ahmed.mansoori@legendrent.internal',
  license_number: 'DL-UAE-882104',
  kyc_status: 'approved',
  license_expiry: '2026-11-15',
  documents: {
    driving_license: 'uploaded',
    national_id: 'uploaded',
    employee_id: 'uploaded',
    insurance: 'pending',
  },
  fleet_vehicles: [
    {
      vehicle_id: 'VH-8821',
      plate_number: 'A 12345',
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      color: 'Pearl White',
    },
    {
      vehicle_id: 'VH-9012',
      plate_number: 'B 77821',
      make: 'Nissan',
      model: 'Patrol',
      year: 2023,
      color: 'Black',
    },
  ],
  rating_avg: 4.7,
  is_online: false,
  avatar_uri: DRIVER_AVATAR_URL,
};
