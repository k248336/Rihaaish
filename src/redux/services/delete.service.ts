import { store } from '../store';
import { api_urls } from '../../utilities';
import { httpClient } from '../../api/httpClient';

export const deleteService = async (api: any, params?: any) => {
  const config = {
    headers: {
      token: api_urls.service_token,
      Authorization: store?.getState()?.auth?.accessToken,
    },
    params: params || {},
  };

  return httpClient
    .delete(api, config)
    .then(res => {
      return res;
    })
    .catch(error => {
      throw error.response || error;
    });
};
