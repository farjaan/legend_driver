import { create } from 'zustand';
import { jobService } from '@api/services/jobService';
import type { DriverJob, JobStatus, RejectReason } from '@domain/job.types';

interface JobState {
  jobs: DriverJob[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  getJob: (jobId: string) => DriverJob | undefined;
  acceptJob: (jobId: string) => Promise<void>;
  rejectJob: (jobId: string, reason: RejectReason) => Promise<void>;
  advanceStatus: (jobId: string, status: JobStatus) => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await jobService.fetchJobList();
      set({ jobs });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load jobs';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
  getJob: jobId => get().jobs.find(j => j.job_id === jobId),
  acceptJob: async jobId => {
    await jobService.acceptJob({ job_id: jobId });
    await get().fetchJobs();
  },
  rejectJob: async (jobId, reason) => {
    await jobService.rejectJob({ job_id: jobId, reason });
    await get().fetchJobs();
  },
  advanceStatus: async (jobId, status) => {
    await jobService.updateJobStatus({ job_id: jobId, job_status: status });
    await get().fetchJobs();
  },
}));
