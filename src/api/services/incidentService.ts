import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';

export interface IncidentReportPayload {
  incident_type: string;
  description: string;
  location: string;
  photo_uris?: string[];
}

export const incidentService = {
  submitReport: async (payload: IncidentReportPayload): Promise<{ report_id: string }> => {
    const res = await post<ApiResponse<{ report_id: string }>>(
      DriverEndpoints.INCIDENT.SUBMIT,
      payload,
    );
    return res.data;
  },
};
