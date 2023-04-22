import axios, { AxiosResponse } from 'axios';

import type { ApiResponse } from 'types/response';

const request = axios.create({
  baseURL: API_URI,
  timeout: 30_000,
});

request.interceptors.response.use((response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
  const { data, status } = response;

  if (status === 200) {
    return data as unknown as AxiosResponse<ApiResponse>;
  }

  return undefined as unknown as AxiosResponse<ApiResponse>;
});

export default request;
