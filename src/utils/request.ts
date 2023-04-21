import axios, { AxiosResponse } from 'axios';

import type { ApiResponse } from 'types/response';

const request = axios.create({
  baseURL: API_URI,
  timeout: 30_000,
});

request.interceptors.response.use((response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
  if (response.status === 200) {
    const data = response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, message, ...rest } = data;

    if (code === 0) {
      return { ...rest } as unknown as AxiosResponse<ApiResponse>;
    }
  }

  return undefined as unknown as AxiosResponse<ApiResponse>;
});

export default request;
