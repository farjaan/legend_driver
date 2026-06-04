import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { USE_LOCAL_API_FALLBACK } from '@config/env';
import { routeLocalDriverApi } from './localApiRouter';

/**
 * Simulates network round-trip for Driver API until backend is live.
 * Disable via USE_LOCAL_API_FALLBACK=false to hit real servers only.
 */
export const localApiAdapter: AxiosAdapter = async config => {
  const method = (config.method ?? 'get').toUpperCase();
  const url = config.url ?? '';
  const data =
    typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data;

  const responseData = await routeLocalDriverApi(method, url, data);

  return {
    data: responseData,
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config: config as InternalAxiosRequestConfig,
  };
};

export function applyLocalApiAdapterIfNeeded(adapter?: AxiosAdapter): AxiosAdapter | undefined {
  if (!USE_LOCAL_API_FALLBACK) return adapter;
  return localApiAdapter;
}
