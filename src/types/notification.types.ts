export type NotificationType = 'new_job' | 'cancel' | 'reschedule' | 'message' | 'penalty';

export interface DriverNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  job_id?: string;
}
