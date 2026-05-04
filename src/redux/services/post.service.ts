import { store } from '../store';
import { api_urls, utility } from '../../utilities';
import { httpClient } from '../../api/httpClient';

export const postService = (
  api: any,
  data: any,
  showError: boolean = true,
  configuration?: any,
) => {
  const config = {
    headers: authHeaders(configuration),
  };

  return httpClient
    .post(api, data || {}, config)
    .then(res => {
      return res;
    })
    .catch(error => {
      showError && utility.checkError(api, error);
      throw error.response || error;
    });
};

/**
 * Sends multipart/form-data using the native `fetch` API.
 * Axios + React Native + FormData often causes "Network Error" because
 * axios breaks the multipart boundary. fetch handles FormData natively.
 */
export const postFormDataService = async (
  api: string,
  formData: FormData,
  showError: boolean = true,
): Promise<{ data: any; status: number }> => {
  const auth = store?.getState()?.auth?.accessToken;
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/${api}`;

  const headers: Record<string, string> = {};
  if (api_urls.service_token) {
    headers['token'] = api_urls.service_token;
  }
  if (auth) {
    headers['Authorization'] = auth;
  }
  // Do NOT set Content-Type — fetch sets multipart/form-data + boundary automatically

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const err = {
        data: responseData,
        status: response.status,
        response: { data: responseData },
        message: responseData?.message ?? 'Request failed',
      };
      if (showError) {
        utility.checkError(api, err);
      }
      throw err;
    }

    return { data: responseData, status: response.status };
  } catch (error: any) {
    if (error?.status) {
      throw error;
    }
    const wrapped = {
      data: null,
      status: 0,
      response: null,
      message: error?.message ?? 'Network Error',
    };
    if (showError) {
      utility.checkError(api, wrapped);
    }
    throw wrapped;
  }
};

/** PATCH multipart/form-data (same as POST FormData — use native fetch). */
export const patchFormDataService = async (
  api: string,
  formData: FormData,
  showError: boolean = true,
): Promise<{ data: any; status: number }> => {
  const auth = store?.getState()?.auth?.accessToken;
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/${api}`;

  const headers: Record<string, string> = {};
  if (api_urls.service_token) {
    headers['token'] = api_urls.service_token;
  }
  if (auth) {
    headers['Authorization'] = auth;
  }

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const err = {
        data: responseData,
        status: response.status,
        response: { data: responseData },
        message: responseData?.message ?? 'Request failed',
      };
      if (showError) {
        utility.checkError(api, err);
      }
      throw err;
    }

    return { data: responseData, status: response.status };
  } catch (error: any) {
    if (error?.status) {
      throw error;
    }
    const wrapped = {
      data: null,
      status: 0,
      response: null,
      message: error?.message ?? 'Network Error',
    };
    if (showError) {
      utility.checkError(api, wrapped);
    }
    throw wrapped;
  }
};
