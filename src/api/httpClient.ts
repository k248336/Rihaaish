import axios from 'axios';
import { getApiBaseUrl } from '../config/apiEnvironment';

/**
 * Single Axios instance for all Redux service calls. Set `api_urls.base_url` in
 * `constants.ts` when the Python backend is ready; services already use relative paths.
 */
export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
});

/**
 * React Native + axios: default POST `Content-Type: application/json` breaks
 * `multipart/form-data` (no boundary) and surfaces as "Network Error". Strip it
 * so axios sets multipart + boundary for FormData.
 */
httpClient.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});
