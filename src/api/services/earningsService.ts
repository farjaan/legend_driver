import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { EarningsRecord, EarningsSummary } from '@domain/earnings.types';

export const earningsService = {
  fetchEarnings: async (): Promise<{ summary: EarningsSummary; records: EarningsRecord[] }> => {
    const res = await post<
      ApiResponse<{ summary: EarningsSummary; records: EarningsRecord[] }>
    >(DriverEndpoints.EARNINGS.SUMMARY, {});
    return res.data;
  },
};
