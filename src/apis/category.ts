import { from } from 'rxjs';

import type { Observable } from 'rxjs';
import type { AxiosResponse } from 'axios';

import { request } from 'utils';

import type { Category, CategoryResponse } from 'types/response';

export const fetchCategory = (): Observable<Category[]> =>
  from<Promise<Category[]>>(
    request
      .get('/categories')
      .then<Category[]>(
        (response: AxiosResponse<CategoryResponse>): Category[] => (response as unknown as CategoryResponse).data,
      ),
  );
