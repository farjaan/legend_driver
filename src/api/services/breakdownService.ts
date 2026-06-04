import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { BreakdownTicket } from '@domain/breakdown.types';

export const breakdownService = {
  fetchTickets: async (): Promise<BreakdownTicket[]> => {
    const res = await post<ApiResponse<{ tickets: BreakdownTicket[] }>>(
      DriverEndpoints.BREAKDOWN.LIST,
      {},
    );
    return res.data.tickets;
  },
};
