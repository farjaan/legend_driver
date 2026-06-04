import { HANDOVER_QR_PREFIX } from '@config/env';
import { DriverEndpoints } from '@api/urls/endpoints';
import {
  BREAKDOWN_TICKETS_SEED,
  CHAUFFEUR_TRIP_SEED,
  DISPATCH_CHAT_SEED,
  DRIVER_PROFILE_SEED,
  JOBS_SEED,
  NOTIFICATIONS_SEED,
  PENALTIES_SEED,
  RATINGS_SEED,
  WEEKLY_SUMMARY_SEED,
} from '@api/seed';
import { buildBookingSummary } from '@api/seed/bookings.seed';
import type { DriverJobDto } from '@api/models/job.models';
import type { ApiResponse } from '@api/models/common.models';

const NETWORK_DELAY_MS = 350;

let jobsState: DriverJobDto[] = JOBS_SEED.map(j => ({ ...j, vehicle: { ...j.vehicle } }));
let driverProfileState = { ...DRIVER_PROFILE_SEED };

const delay = <T>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), NETWORK_DELAY_MS));

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function normalizePath(url: string): string {
  try {
    const u = new URL(url, 'https://legend.local');
    return u.pathname;
  } catch {
    return url.split('?')[0] ?? url;
  }
}

export async function routeLocalDriverApi(
  method: string,
  url: string,
  body?: unknown,
): Promise<unknown> {
  const path = normalizePath(url);
  const payload = (body ?? {}) as Record<string, unknown>;

  switch (path) {
    case DriverEndpoints.AUTH.SEND_LOGIN_OTP:
      return delay(ok({ sent: true }));

    case DriverEndpoints.AUTH.VERIFY_LOGIN_OTP: {
      const phone = String(payload.phone ?? '');
      const otp = String(payload.otp ?? '');
      if (otp !== '123456') {
        return delay({ success: false, message: 'Invalid OTP' });
      }
      return delay(
        ok({
          access_token: 'local-access-token',
          refresh_token: 'local-refresh-token',
          session_id: 'local-session',
          profile: { ...driverProfileState, phone: phone || driverProfileState.phone },
        }),
      );
    }

    case DriverEndpoints.AUTH.LOGIN_EMPLOYEE: {
      const employeeId = String(payload.employee_id ?? '');
      const pin = String(payload.pin ?? '');
      if (employeeId !== 'EMP-1001' || pin !== '1234') {
        return delay({ success: false, message: 'Invalid credentials' });
      }
      return delay(
        ok({
          access_token: 'local-access-token',
          refresh_token: 'local-refresh-token',
          session_id: 'local-session',
          profile: driverProfileState,
        }),
      );
    }

    case DriverEndpoints.JOBS.LIST:
      return delay(ok({ jobs: jobsState }));

    case DriverEndpoints.JOBS.DETAIL: {
      const jobId = String(payload.job_id ?? '');
      const job = jobsState.find(j => j.job_id === jobId);
      if (!job) {
        return delay(ok({ job: null, booking: null }));
      }
      const booking = buildBookingSummary({
        booking_id: job.booking_id,
        booking_reference: job.booking_reference,
        customer_name: job.customer_name,
        customer_phone_masked: job.customer_phone_masked,
        pick_up_address: job.pick_up_address,
        drop_off_address: job.drop_off_address,
        delivery_status: job.delivery_status,
        scheduled_at: job.scheduled_at,
        job_type: job.job_type,
      });
      return delay(ok({ job, booking }));
    }

    case DriverEndpoints.JOBS.ACCEPT: {
      const jobId = String(payload.job_id ?? '');
      jobsState = jobsState.map(j =>
        j.job_id === jobId ? { ...j, job_status: 'accepted' } : j,
      );
      return delay(ok({ job_id: jobId, job_status: 'accepted' }));
    }

    case DriverEndpoints.JOBS.REJECT: {
      const jobId = String(payload.job_id ?? '');
      jobsState = jobsState.map(j =>
        j.job_id === jobId ? { ...j, job_status: 'rejected' } : j,
      );
      return delay(ok({ job_id: jobId, job_status: 'rejected' }));
    }

    case DriverEndpoints.JOBS.UPDATE_STATUS: {
      const jobId = String(payload.job_id ?? '');
      const jobStatus = String(payload.job_status ?? '');
      jobsState = jobsState.map(j =>
        j.job_id === jobId ? { ...j, job_status: jobStatus as DriverJobDto['job_status'] } : j,
      );
      return delay(ok({ job_id: jobId, job_status: jobStatus }));
    }

    case DriverEndpoints.HANDOVER.CHECKOUT:
    case DriverEndpoints.HANDOVER.CHECKIN:
      return delay(ok(payload));

    case DriverEndpoints.HANDOVER.VERIFY_OTP: {
      const otp = String(payload.otp ?? '');
      return delay({
        success: otp === '123456',
        message: otp === '123456' ? 'Verified' : 'Invalid OTP',
      });
    }

    case DriverEndpoints.HANDOVER.VERIFY_QR: {
      const qr = String(payload.qr_payload ?? payload.payload ?? '');
      const valid = qr.startsWith(HANDOVER_QR_PREFIX);
      return delay({
        success: valid,
        booking_reference: valid ? qr.replace(HANDOVER_QR_PREFIX, 'LGC-2026-') : null,
      });
    }

    case DriverEndpoints.CHAUFFEUR.TRIP_DETAIL:
      return delay(ok(CHAUFFEUR_TRIP_SEED));

    case DriverEndpoints.BREAKDOWN.LIST:
      return delay(ok({ tickets: BREAKDOWN_TICKETS_SEED }));

    case DriverEndpoints.CHAT.DISPATCH_MESSAGES:
      return delay(ok({ messages: DISPATCH_CHAT_SEED }));

    case DriverEndpoints.PROFILE.SUMMARY:
      return delay(ok(WEEKLY_SUMMARY_SEED));

    case DriverEndpoints.PROFILE.RATINGS:
      return delay(ok({ ratings: RATINGS_SEED }));

    case DriverEndpoints.PROFILE.PENALTIES:
      return delay(ok({ penalties: PENALTIES_SEED }));

    case DriverEndpoints.PROFILE.UPDATE: {
      driverProfileState = {
        ...driverProfileState,
        ...(payload as Partial<typeof driverProfileState>),
      };
      return delay(ok({ profile: driverProfileState }));
    }

    case DriverEndpoints.NOTIFICATIONS.LIST:
      return delay(ok({ notifications: NOTIFICATIONS_SEED }));

    default:
      return delay({ success: false, message: `No local handler for ${method} ${path}` });
  }
}
