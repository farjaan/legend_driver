import { HANDOVER_QR_PREFIX } from '@config/env';
import { DriverEndpoints } from '@api/urls/endpoints';
import {
  BREAKDOWN_TICKETS_SEED,
  CHAT_THREADS_SEED,
  DISPATCH_CHAT_SEED,
  DRIVER_PROFILE_SEED,
  EARNINGS_RECORDS_SEED,
  EARNINGS_SUMMARY_SEED,
  JOBS_SEED,
  NOTIFICATIONS_SEED,
  PENALTIES_SEED,
  RATINGS_SEED,
  SUPPORT_TICKETS_SEED,
  WEEKLY_SUMMARY_SEED,
} from '@api/seed';
import type { SupportTicket } from '@domain/support.types';
import type { ChauffeurTrip } from '@domain/chauffeur.types';
import { buildChauffeurTripFromJob } from '@api/seed/chauffeurTrip.seed';
import { buildBookingSummary } from '@api/seed/bookings.seed';
import type { DriverJobDto } from '@api/models/job.models';
import type { ApiResponse } from '@api/models/common.models';

const NETWORK_DELAY_MS = 350;

let jobsState: DriverJobDto[] = JOBS_SEED.map(j => ({ ...j, vehicle: { ...j.vehicle } }));
let driverProfileState = { ...DRIVER_PROFILE_SEED };
let supportTicketsState: SupportTicket[] = SUPPORT_TICKETS_SEED.map(t => ({
  ...t,
  messages: [...t.messages],
}));
const chauffeurTripsState: Record<string, ChauffeurTrip> = {};

function getJobOrThrow(jobId: string): DriverJobDto {
  const job = jobsState.find(j => j.job_id === jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);
  return job;
}

function getChauffeurTrip(jobId: string): ChauffeurTrip {
  const job = getJobOrThrow(jobId);
  const existing = chauffeurTripsState[jobId];
  const trip = buildChauffeurTripFromJob(job, existing);
  chauffeurTripsState[jobId] = trip;
  return trip;
}

function setJobStatus(jobId: string, status: DriverJobDto['job_status']) {
  jobsState = jobsState.map(j => (j.job_id === jobId ? { ...j, job_status: status } : j));
}

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

    case DriverEndpoints.CHAUFFEUR.TRIP_DETAIL: {
      const jobId = String(payload.job_id ?? '');
      return delay(ok(getChauffeurTrip(jobId)));
    }

    case DriverEndpoints.CHAUFFEUR.ARRIVE: {
      const jobId = String(payload.job_id ?? '');
      const now = new Date().toISOString();
      setJobStatus(jobId, 'arrived');
      const trip = getChauffeurTrip(jobId);
      chauffeurTripsState[jobId] = {
        ...trip,
        arrived_at: now,
        phase: 'arrived',
        stops: trip.stops.map((s, i) => (i === 0 ? { ...s, completed: true } : s)),
      };
      return delay(ok({ trip: chauffeurTripsState[jobId] }));
    }

    case DriverEndpoints.CHAUFFEUR.START: {
      const jobId = String(payload.job_id ?? '');
      const otp = String(payload.otp ?? '');
      if (otp !== '123456') {
        return delay({ success: false, message: 'Invalid ride OTP' });
      }
      const now = new Date().toISOString();
      setJobStatus(jobId, 'handover_in_progress');
      const trip = getChauffeurTrip(jobId);
      chauffeurTripsState[jobId] = {
        ...trip,
        started_at: now,
        phase: 'in_progress',
        elapsed_seconds: 0,
        distance_km: 0,
      };
      return delay(ok({ trip: chauffeurTripsState[jobId] }));
    }

    case DriverEndpoints.CHAUFFEUR.END: {
      const jobId = String(payload.job_id ?? '');
      const elapsed = Number(payload.elapsed_seconds ?? 0);
      const now = new Date().toISOString();
      setJobStatus(jobId, 'completed');
      const trip = getChauffeurTrip(jobId);
      const distanceKm = Math.max(8.2, Math.round((elapsed / 360) * 10) / 10);
      const completedTrip: ChauffeurTrip = {
        ...trip,
        ended_at: now,
        phase: 'completed',
        elapsed_seconds: elapsed,
        distance_km: distanceKm,
        stops: trip.stops.map(s => ({ ...s, completed: true })),
      };
      chauffeurTripsState[jobId] = completedTrip;
      return delay(
        ok({
          trip: completedTrip,
          stops_completed: completedTrip.stops.filter(s => s.completed).length,
        }),
      );
    }

    case DriverEndpoints.BREAKDOWN.LIST:
      return delay(ok({ tickets: BREAKDOWN_TICKETS_SEED }));

    case DriverEndpoints.CHAT.THREADS:
      return delay(ok({ threads: CHAT_THREADS_SEED }));

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

    case DriverEndpoints.AUTH.PROFILE:
      return delay(ok({ profile: driverProfileState }));

    case DriverEndpoints.AUTH.LOGOUT:
      return delay(ok({ logged_out: true }));

    case DriverEndpoints.EARNINGS.SUMMARY:
      return delay(
        ok({ summary: EARNINGS_SUMMARY_SEED, records: EARNINGS_RECORDS_SEED }),
      );

    case DriverEndpoints.SUPPORT.LIST:
      return delay(ok({ tickets: supportTicketsState }));

    case DriverEndpoints.SUPPORT.CREATE: {
      const category = String(payload.category ?? 'app');
      const priority = String(payload.priority ?? 'medium');
      const subject = String(payload.subject ?? '');
      const description = String(payload.description ?? '');
      const ticket: SupportTicket = {
        ticket_id: `ST-${Date.now()}`,
        ticket_number: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        category: category as SupportTicket['category'],
        priority: priority as SupportTicket['priority'],
        status: 'open',
        subject,
        description,
        created_at: new Date().toISOString(),
        location: payload.location ? String(payload.location) : undefined,
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'driver',
            body: description,
            sent_at: new Date().toISOString(),
            attachment_uri: payload.attachment_uri
              ? String(payload.attachment_uri)
              : undefined,
          },
        ],
      };
      supportTicketsState = [ticket, ...supportTicketsState];
      return delay(ok({ ticket }));
    }

    case DriverEndpoints.SUPPORT.REPLY: {
      const ticketId = String(payload.ticket_id ?? '');
      const body = String(payload.body ?? '');
      const message = {
        id: `m-${Date.now()}`,
        sender: 'driver' as const,
        body,
        sent_at: new Date().toISOString(),
        attachment_uri: payload.attachment_uri
          ? String(payload.attachment_uri)
          : undefined,
      };
      supportTicketsState = supportTicketsState.map(t =>
        t.ticket_id === ticketId
          ? {
              ...t,
              status: t.status === 'closed' ? 'closed' : ('in_progress' as const),
              messages: [...t.messages, message],
            }
          : t,
      );
      return delay(ok({ message }));
    }

    case DriverEndpoints.INCIDENT.SUBMIT:
      return delay(ok({ report_id: `INC-${Date.now()}` }));

    case DriverEndpoints.PROFILE.SHIFT:
      return delay(ok({ is_online: Boolean(payload.is_online) }));

    default:
      return delay({ success: false, message: `No local handler for ${method} ${path}` });
  }
}
