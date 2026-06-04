import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type {
  AuthSessionResponse,
  LoginEmployeeRequest,
  SendLoginOtpRequest,
  VerifyLoginOtpRequest,
} from '@api/models/auth.models';

export const authService = {
  sendLoginOtp: (payload: SendLoginOtpRequest) =>
    post<ApiResponse<{ sent: boolean }>>(DriverEndpoints.AUTH.SEND_LOGIN_OTP, payload),

  verifyLoginOtp: (payload: VerifyLoginOtpRequest) =>
    post<ApiResponse<AuthSessionResponse> | { success: false; message: string }>(
      DriverEndpoints.AUTH.VERIFY_LOGIN_OTP,
      payload,
    ),

  loginEmployee: (payload: LoginEmployeeRequest) =>
    post<ApiResponse<AuthSessionResponse> | { success: false; message: string }>(
      DriverEndpoints.AUTH.LOGIN_EMPLOYEE,
      payload,
    ),
};
