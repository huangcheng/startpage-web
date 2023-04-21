import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Pagination } from 'types/request';
import type { FetchSitesByCategoryResult } from 'types/response';

export const fetchSitesByCategory = (id: number, page: Pagination): Observable<FetchSitesByCategoryResult> =>
  from<Promise<FetchSitesByCategoryResult>>(request.get(`/category/${id}/sites`, { params: page }));
