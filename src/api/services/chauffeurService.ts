import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { ChauffeurTrip, ChauffeurTripSummary } from '@domain/chauffeur.types';

export const chauffeurService = {
  fetchTrip: async (jobId: string): Promise<ChauffeurTrip> => {
    const res = await post<ApiResponse<ChauffeurTrip>>(DriverEndpoints.CHAUFFEUR.TRIP_DETAIL, {
      job_id: jobId,
    });
    return res.data;
  },

  markEnRoute: async (jobId: string): Promise<ChauffeurTrip> => {
    await post(DriverEndpoints.JOBS.UPDATE_STATUS, {
      job_id: jobId,
      job_status: 'en_route',
    });
    return chauffeurService.fetchTrip(jobId);
  },

  arriveAtPickup: async (jobId: string): Promise<ChauffeurTrip> => {
    const res = await post<ApiResponse<{ trip: ChauffeurTrip }>>(
      DriverEndpoints.CHAUFFEUR.ARRIVE,
      { job_id: jobId },
    );
    return res.data.trip;
  },

  startTrip: async (
    jobId: string,
    otp: string,
  ): Promise<ChauffeurTrip | { success: false; message: string }> => {
    const res = await post<
      ApiResponse<{ trip: ChauffeurTrip }> | { success: false; message: string }
    >(DriverEndpoints.CHAUFFEUR.START, { job_id: jobId, otp });
    if (!res.success || !('data' in res)) {
      const msg = 'message' in res && res.message ? res.message : 'Invalid ride OTP';
      return { success: false, message: msg };
    }
    return res.data.trip;
  },

  endTrip: async (jobId: string, elapsedSeconds: number): Promise<ChauffeurTripSummary> => {
    const res = await post<ApiResponse<ChauffeurTripSummary>>(DriverEndpoints.CHAUFFEUR.END, {
      job_id: jobId,
      elapsed_seconds: elapsedSeconds,
    });
    return res.data;
  },
};
