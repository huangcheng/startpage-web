import { from } from 'rxjs';
import omit from 'lodash-es/omit';
import isNumber from 'lodash-es/isNumber';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Site, SiteResponse } from 'types/response';
import type { CreateSite, UpdateSite } from 'types/request';

export const fetchSitesByCategory = (id: number, search?: string): Observable<Site[]> => {
  if (!isNumber(id)) {
    return from<Promise<Site[]>>(Promise.resolve([]));
  }

  let query = `/category/${id}/sites`;

  if (search) {
    query += `?search=${search}`;
  }

  return from<Promise<Site[]>>(request.get(query));
};

export const fetchSite = (id: number): Observable<Site> => from<Promise<Site>>(request.get(`/site/${id}`));

export const fetchSites = (page: number, size: number, search?: string): Observable<SiteResponse> => {
  let query: string = `page=${page}&size=${size}`;

  if (search) {
    query += `&search=${search}`;
  }

  return from<Promise<SiteResponse>>(request.get(`/sites?${query}`));
};

export const createSite = (site: CreateSite): Observable<void> => from<Promise<void>>(request.post('/site', site));

export const updateSite = (id: number, site: Omit<UpdateSite, 'id'>): Observable<void> =>
  from<Promise<void>>(request.put(`/site/${id}`, omit(site, ['id'])));

export const deleteSite = (id: number): Observable<void> => from<Promise<void>>(request.delete(`/site/${id}`));
