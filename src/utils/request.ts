import axios, { AxiosError } from 'axios';
import Cookie from 'js-cookie';

import type { AxiosResponse } from 'axios';

import type { ApiResponse } from 'types/response';

const token = Cookie.get('token');

const request = axios.create({
  baseURL: API_URI,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
  withCredentials: true,
});

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
    const { data, status } = response;

    if (status === 200) {
      return data as unknown as AxiosResponse<ApiResponse>;
    }

    return undefined as unknown as AxiosResponse<ApiResponse>;
  },
  (error: AxiosError) => {
    const { response } = error;
    const { status } = response ?? {};

    if (status === 401) {
      Cookie.remove('token');

      window.location.href = '/login';
    }
  },
);

export default request;
