import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { ChauffeurTrip } from '@domain/chauffeur.types';

export const chauffeurService = {
  fetchTrip: async (jobId: string): Promise<ChauffeurTrip> => {
    const res = await post<ApiResponse<ChauffeurTrip>>(DriverEndpoints.CHAUFFEUR.TRIP_DETAIL, {
      job_id: jobId,
    });
    return { ...res.data, job_id: jobId };
  },
};
