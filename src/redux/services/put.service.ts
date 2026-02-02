import axios from 'axios';
import { store } from '../store';
import { api_urls, utility } from '../../utilities';

export const putService = (
  api: any,
  data: any,
  showError = true,
  configuration: any,
) => {
  const config = {
    headers: {
      ...configuration,
      token: api_urls.service_token,
      Authorization: store?.getState()?.auth?.accessToken,
    },
  };

  return axios
    .put(api_urls.base_url + api, data || {}, config)
    .then(res => {
      return res;
    })
    .catch(error => {
      showError && utility.checkError(api, error);
      throw error.response || error;
    });
};
