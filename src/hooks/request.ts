import { useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';

import type { Observable } from 'rxjs';
import type { UseQueryResult } from 'react-query';

import { fetchCategory, fetchSitesByCategory } from 'apis';

import type { FetchCategoryResult, FetchSitesByCategoryResult } from 'types/response';
import type { Pagination } from 'types/request';

export function useFetchCategoryQuery(pagination?: Pagination): UseQueryResult<FetchCategoryResult> {
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 100;

  return useQuery<FetchCategoryResult, Error>(['fetchCategory', page, size], async (): Promise<FetchCategoryResult> => {
    const result$: Observable<FetchCategoryResult> = fetchCategory({ page, size });

    return await lastValueFrom<FetchCategoryResult>(result$);
  });
}

export function useFetchCategorySitesQuery(
  id: number,
  pagination?: Pagination,
): UseQueryResult<FetchSitesByCategoryResult> {
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 100;

  return useQuery<FetchSitesByCategoryResult, Error>(
    ['fetchSitesByCategory', id, page, size],
    async (): Promise<FetchSitesByCategoryResult> => {
      const result$: Observable<FetchSitesByCategoryResult> = fetchSitesByCategory(id, { page, size });

      return await lastValueFrom(result$);
    },
  );
}
