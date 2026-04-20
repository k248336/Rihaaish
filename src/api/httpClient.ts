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
