import axios from 'axios';
import { store } from '../store';
import { api_urls } from '../../utilities';

export const getService = async (api: any, params?: any) => {
  const config = {
    headers: {
      token: api_urls.service_token,
      Authorization: store?.getState()?.auth?.accessToken,
    },
    params: params || {},
  };

  return axios
    .get(api_urls.base_url + api, config)
    .then(res => {
      return res;
    })
    .catch(error => {
      throw error.response || error;
    });
};
