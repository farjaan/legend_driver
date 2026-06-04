import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { CheckinPayload, CheckoutPayload } from '@domain/handover.types';

export const handoverService = {
  submitCheckout: (payload: CheckoutPayload) =>
    post<ApiResponse<CheckoutPayload>>(DriverEndpoints.HANDOVER.CHECKOUT, payload),

  submitCheckin: (payload: CheckinPayload) =>
    post<ApiResponse<CheckinPayload>>(DriverEndpoints.HANDOVER.CHECKIN, payload),

  verifyOtp: (bookingId: number, otp: string) =>
    post<{ success: boolean; message: string }>(DriverEndpoints.HANDOVER.VERIFY_OTP, {
      booking_id: bookingId,
      otp,
    }),

  verifyQr: (qrPayload: string) =>
    post<{ success: boolean; booking_reference?: string | null }>(
      DriverEndpoints.HANDOVER.VERIFY_QR,
      { qr_payload: qrPayload },
    ),
};
