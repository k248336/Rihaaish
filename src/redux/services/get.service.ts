import { store } from '../store';
import { api_urls } from '../../utilities';
import { httpClient } from '../../api/httpClient';

function buildAuthHeaders(extra?: Record<string, string>) {
  const auth = store?.getState()?.auth?.accessToken;
  return {
    ...extra,
    ...(api_urls.service_token ? { token: api_urls.service_token } : {}),
    ...(auth ? { Authorization: auth } : {}),
  };
}

export const getService = async (api: any, params?: any) => {
  const config = {
    headers: buildAuthHeaders(),
    params: params || {},
  };

  return httpClient
    .get(api, config)
    .then(res => {
      return res;
    })
    .catch(error => {
      throw error.response || error;
    });
};
