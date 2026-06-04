import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Attach Bearer token from auth store when live API is enabled.
  return config;
};

export const requestErrorInterceptor = (error: unknown) => Promise.reject(error);
