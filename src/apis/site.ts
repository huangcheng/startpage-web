import { from } from 'rxjs';
import OmitBy from 'lodash-es/omitBy';
import isEmpty from 'lodash-es/isEmpty';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Site, SiteResponse } from 'types/response';
import type { CreateSite, UpdateSite } from 'types/request';

export const fetchSitesByCategory = (id: number): Observable<Site[]> =>
  from<Promise<Site[]>>(request.get(`/category/${id}/sites`));

export const fetchSites = (page: number, size: number, search?: string): Observable<SiteResponse> => {
  let query: string = `page=${page}&size=${size}`;

  if (search) {
    query += `&search=${search}`;
  }

  return from<Promise<SiteResponse>>(request.get(`/sites?${query}`));
};

export const createSite = (site: CreateSite): Observable<void> => from<Promise<void>>(request.post('/site', site));

export const updateSite = (id: number, site: Omit<UpdateSite, 'id'>): Observable<void> =>
  from<Promise<void>>(request.put(`/site/${id}`, OmitBy(site, isEmpty)));

export const deleteSite = (id: number): Observable<void> => from<Promise<void>>(request.delete(`/site/${id}`));
