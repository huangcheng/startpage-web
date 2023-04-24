import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Site } from 'types/response';

export const fetchSitesByCategory = (id: string): Observable<Site[]> =>
  from<Promise<Site[]>>(request.get(`/category/${id}/sites`));
