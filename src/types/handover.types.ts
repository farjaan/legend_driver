export interface CarPhotoPayload {
  image: string;
  local_source?: number;
  uri?: string;
}

export interface CheckInDamage {
  description: string;
  cost: number;
}

export interface CheckoutPayload {
  booking_id: number;
  checkout_oldmeter_reading: number;
  checkout_fuel_level: string;
  checkout_car_checklist: string[];
  checkout_existing_scratches: string;
  checkout_car_photos: CarPhotoPayload[];
  checkout_customer_signed: boolean;
}

export interface CheckinPayload {
  booking_id: number;
  check_in_branch_location: string;
  check_in_final_odometer: number;
  check_in_fuel_level: string;
  check_in_damages: CheckInDamage[];
  check_in_traffic_fines: number;
  check_in_total_damages: number;
  check_in_final_payable: string;
  check_in_car_photos: CarPhotoPayload[];
  check_in_customer_signed: boolean;
}

export type FuelLevel = 'Empty' | '1/4' | '1/2' | '3/4' | 'Full';
