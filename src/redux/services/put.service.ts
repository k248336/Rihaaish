import { store } from '../store';
import { api_urls, utility } from '../../utilities';
import { httpClient } from '../../api/httpClient';

export const putService = (
  api: any,
  data: any,
  showError = true,
  configuration?: any,
) => {
  const config = {
    headers: {
      ...configuration,
      token: api_urls.service_token,
      Authorization: store?.getState()?.auth?.accessToken,
    },
  };

  return httpClient
    .put(api, data || {}, config)
    .then(res => {
      return res;
    })
    .catch(error => {
      showError && utility.checkError(api, error);
      throw error.response || error;
    });
};
