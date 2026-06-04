import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { PenaltyRecord, RatingRecord, WeeklySummary } from '@api/models/profile.models';
import type { DriverProfile } from '@domain/driver.types';

export const profileService = {
  fetchWeeklySummary: async (): Promise<WeeklySummary> => {
    const res = await post<ApiResponse<WeeklySummary>>(DriverEndpoints.PROFILE.SUMMARY, {});
    return res.data;
  },

  fetchRatings: async (): Promise<RatingRecord[]> => {
    const res = await post<ApiResponse<{ ratings: RatingRecord[] }>>(
      DriverEndpoints.PROFILE.RATINGS,
      {},
    );
    return res.data.ratings;
  },

  fetchPenalties: async (): Promise<PenaltyRecord[]> => {
    const res = await post<ApiResponse<{ penalties: PenaltyRecord[] }>>(
      DriverEndpoints.PROFILE.PENALTIES,
      {},
    );
    return res.data.penalties;
  },

  updateProfile: async (patch: Partial<DriverProfile>): Promise<DriverProfile> => {
    const res = await post<ApiResponse<{ profile: DriverProfile }>>(
      DriverEndpoints.PROFILE.UPDATE,
      patch,
    );
    return res.data.profile;
  },
};
