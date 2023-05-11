import { useQuery, useMutation } from 'react-query';
import { lastValueFrom, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import type { Observable } from 'rxjs';
import type { UseQueryResult, UseMutationResult } from 'react-query';

import { fetchCategory, fetchSitesByCategory, login } from 'apis';

import type { Category, Site, CategorySites } from 'types/response';
import type { User } from 'types/request';

export function useFetchCategoryQuery(): UseQueryResult<Category[]> {
  return useQuery<Category[], Error>(['fetchCategory'], async (): Promise<Category[]> => {
    const result$: Observable<Category[]> = fetchCategory();

    return await lastValueFrom<Category[]>(result$);
  });
}

export function useFetchCategorySitesQuery(categories: Category[]): UseQueryResult<CategorySites[]> {
  return useQuery<CategorySites[], Error>(
    ['fetchSitesByCategory', categories.map(({ id }) => id)],
    async (): Promise<CategorySites[]> => {
      const result$: Observable<CategorySites[]> = forkJoin(categories.map(({ id }) => fetchSitesByCategory(id))).pipe(
        map<Site[][], CategorySites[]>((sites) =>
          categories.map((category, index) => ({ ...category, sites: sites[index] })),
        ),
      );

      return await lastValueFrom<CategorySites[]>(result$);
    },
  );
}

export function useLoginMutation(): UseMutationResult<void, Error, User> {
  return useMutation<void, Error, User>(['login'], async (user: User): Promise<void> => {
    const result$: Observable<void> = login(user);

    return await lastValueFrom<void>(result$);
  });
}
