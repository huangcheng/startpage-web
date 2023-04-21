import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Pagination } from 'types/request';
import type { FetchCategoryResult } from 'types/response';

export const fetchCategory = (page: Pagination): Observable<FetchCategoryResult> =>
  from<Promise<FetchCategoryResult>>(request.get('/category/all', { params: page }));
