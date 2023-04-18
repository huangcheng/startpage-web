import { useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';

import type { Observable } from 'rxjs';
import type { UseQueryResult } from 'react-query';

import { fetchCategory } from 'apis/category';

import type { FetchCategoryResult } from 'types/response';
import type { Pagination } from 'types/request';

export function useFetchCategoryQuery(pagination?: Pagination): UseQueryResult<FetchCategoryResult> {
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 100;

  return useQuery<FetchCategoryResult, Error>(['fetchCategory', page, size], async (): Promise<FetchCategoryResult> => {
    const result$: Observable<FetchCategoryResult> = fetchCategory({ page, size });

    return await lastValueFrom<FetchCategoryResult>(result$);
  });
}
