import { store } from '../store';
import { api_urls } from '../../utilities';
import { httpClient } from '../../api/httpClient';

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
