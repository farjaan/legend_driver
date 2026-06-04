import axios from 'axios';
import { API_BASE_URL } from '@api/urls/baseURL';
import { applyLocalApiAdapterIfNeeded } from '@api/local/localApiAdapter';
import {
  requestErrorInterceptor,
  requestInterceptor,
} from '@api/interceptors/requestInterceptor';
import {
  responseErrorInterceptor,
  responseInterceptor,
} from '@api/interceptors/responseInterceptor';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30000,
  adapter: applyLocalApiAdapterIfNeeded(),
});

api.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
