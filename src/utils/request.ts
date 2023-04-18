import axios, { AxiosResponse } from 'axios';

import { FetchCategoryResponse } from 'types/response';

type Response = FetchCategoryResponse;

const request = axios.create({
  baseURL: API_URI,
  timeout: 30_000,
});

request.interceptors.response.use((response: AxiosResponse<Response>): AxiosResponse<Response> => {
  if (response.status === 200) {
    const data = response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, message, ...rest } = data;

    if (code === 0) {
      return { ...rest } as unknown as AxiosResponse<Response>;
    }
  }

  return undefined as unknown as AxiosResponse<Response>;
});

export default request;
