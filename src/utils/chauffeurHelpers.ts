import type { ChauffeurTripPhase } from '@domain/chauffeur.types';
import type { DriverJob, JobStatus, JobType } from '@domain/job.types';
import type { RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export function isChauffeurJob(job: Pick<DriverJob, 'job_type'>): boolean {
  return job.job_type === 'chauffeur';
}

export function jobStatusToTripPhase(status: JobStatus): ChauffeurTripPhase {
  switch (status) {
    case 'assigned':
      return 'pending';
    case 'accepted':
    case 'en_route':
      return 'navigating';
    case 'arrived':
      return 'arrived';
    case 'handover_in_progress':
      return 'in_progress';
    case 'completed':
      return 'completed';
    default:
      return 'pending';
  }
}

export type ChauffeurRouteScreen =
  | 'ChauffeurNavigation'
  | 'ChauffeurStartTrip'
  | 'ChauffeurActiveTrip'
  | 'TripSummary';

export function chauffeurScreenForStatus(status: JobStatus): ChauffeurRouteScreen | null {
  switch (status) {
    case 'accepted':
    case 'en_route':
      return 'ChauffeurNavigation';
    case 'arrived':
      return 'ChauffeurStartTrip';
    case 'handover_in_progress':
      return 'ChauffeurActiveTrip';
    case 'completed':
      return 'TripSummary';
    default:
      return null;
  }
}

export function navigateChauffeurFlow(navigation: RootNav, job: DriverJob): void {
  const screen = chauffeurScreenForStatus(job.job_status);
  if (!screen) return;
  navigation.navigate(screen, { jobId: job.job_id });
}

export function chauffeurPrimaryActionKey(status: JobStatus): string | null {
  switch (status) {
    case 'accepted':
    case 'en_route':
      return 'chauffeur.navigatePickup';
    case 'arrived':
      return 'chauffeur.startTrip';
    case 'handover_in_progress':
      return 'chauffeur.resumeTrip';
    case 'completed':
      return 'chauffeur.viewSummary';
    default:
      return null;
  }
}

export function chauffeurFlowLabel(type: JobType): string {
  return type === 'chauffeur' ? 'Chauffeur ride' : '';
}
