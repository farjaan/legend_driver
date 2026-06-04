import type { DriverProfile } from '@domain/driver.types';

export interface SendLoginOtpRequest {
  phone: string;
  country_code?: string;
}

export interface VerifyLoginOtpRequest {
  phone: string;
  otp: string;
}

export interface LoginEmployeeRequest {
  employee_id: string;
  pin: string;
}

export interface AuthSessionResponse {
  access_token: string;
  refresh_token: string;
  session_id: string;
  profile: DriverProfile;
}
