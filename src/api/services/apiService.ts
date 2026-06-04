import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '@api/restClient';
import type { ApiError, RequestConfig } from '@api/models/common.models';

const toAxiosConfig = (config?: RequestConfig): AxiosRequestConfig => ({
  params: config?.params,
  headers: config?.headers,
  timeout: config?.timeout ?? 30000,
  signal: config?.signal,
});

const handleError = (error: unknown): ApiError => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  ) {
    return error as ApiError;
  }
  return { status: 0, message: 'Unexpected error' };
};

export const get = async <T>(url: string, config?: RequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(url, toAxiosConfig(config));
    return response.data;
  } catch (e) {
    throw handleError(e);
  }
};

export const post = async <T>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data, toAxiosConfig(config));
    return response.data;
  } catch (e) {
    throw handleError(e);
  }
};
