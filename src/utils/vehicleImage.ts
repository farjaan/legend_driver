import { PlaceholderImages } from '@assets/placeholders';
import type { JobVehicle } from '@domain/job.types';

export function getVehicleImageProps(vehicle: JobVehicle) {
  return {
    uri: vehicle.image_uri,
    localSource: vehicle.image ?? PlaceholderImages.carFront,
  };
}
