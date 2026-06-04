import { post } from '@api/services/apiService';
import { mapJobDtoToDriverJob, mapJobListDto } from '@api/mappers/jobMapper';
import type { BookingSummary } from '@api/models/booking.models';
import type { DriverJobDto } from '@api/models/job.models';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type {
  AcceptJobRequest,
  FetchJobListResponse,
  RejectJobRequest,
  UpdateJobStatusRequest,
} from '@api/models/job.models';
import type { DriverJob, JobStatus } from '@domain/job.types';

export const jobService = {
  fetchJobList: async (): Promise<DriverJob[]> => {
    const res = await post<ApiResponse<FetchJobListResponse>>(DriverEndpoints.JOBS.LIST, {});
    return mapJobListDto(res.data.jobs);
  },

  fetchJobDetail: async (
    jobId: string,
  ): Promise<{ job: DriverJob; booking: BookingSummary } | null> => {
    const res = await post<
      ApiResponse<{ job: DriverJobDto | null; booking: BookingSummary | null }>
    >(DriverEndpoints.JOBS.DETAIL, { job_id: jobId });
    if (!res.data.job || !res.data.booking) return null;
    return {
      job: mapJobDtoToDriverJob(res.data.job),
      booking: res.data.booking,
    };
  },

  acceptJob: (payload: AcceptJobRequest) =>
    post<ApiResponse<{ job_id: string; job_status: JobStatus }>>(
      DriverEndpoints.JOBS.ACCEPT,
      payload,
    ),

  rejectJob: (payload: RejectJobRequest) =>
    post<ApiResponse<{ job_id: string; job_status: JobStatus }>>(
      DriverEndpoints.JOBS.REJECT,
      payload,
    ),

  updateJobStatus: (payload: UpdateJobStatusRequest) =>
    post<ApiResponse<{ job_id: string; job_status: JobStatus }>>(
      DriverEndpoints.JOBS.UPDATE_STATUS,
      payload,
    ),
};
