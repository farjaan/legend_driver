/**
 * API environment — same base URLs as legend-car-rental user app.
 * Set USE_LOCAL_API_FALLBACK to false when Driver backend is live on these hosts.
 */
export const API_BASE_URL_DEFAULT = 'https://admin-portal-stg.legendrentacar.com';

/** When true, Driver `/Driver/Api/*` calls are handled locally until backend is deployed. */
export const USE_LOCAL_API_FALLBACK = true;

export const HANDOVER_QR_PREFIX = 'LGC-HANDOVER-';

export const DEFAULT_MAP_REGION = {
  latitude: 25.2048,
  longitude: 55.2708,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
} as const;
