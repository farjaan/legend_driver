import type { AxiosResponse } from 'axios';
import type { ApiError } from '@api/models/common.models';

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorInterceptor = (error: unknown): Promise<never> => {
  const err = error as {
    response?: { status?: number; data?: { message?: string } };
    message?: string;
  };
  const apiError: ApiError = {
    status: err.response?.status ?? 0,
    message: err.response?.data?.message ?? err.message ?? 'Network error',
  };
  return Promise.reject(apiError);
};
