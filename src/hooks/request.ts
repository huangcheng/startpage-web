import { useQuery, useMutation } from 'react-query';
import { lastValueFrom, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { message } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import type { Observable } from 'rxjs';
import type { UseQueryResult, UseMutationResult } from 'react-query';
import type { AxiosError } from 'axios';

import { fetchCategory, fetchSitesByCategory, login, fetchUser } from 'apis';

import type { Category, Site, CategorySites, UserInfo } from 'types/response';
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation<void, Error, User>(
    ['login'],
    async (user: User): Promise<void> => {
      const result$: Observable<void> = login(user);

      return await lastValueFrom<void>(result$);
    },
    {
      onError: (error) => {
        const { response } = error as AxiosError;
        const { status } = response ?? {};

        let message_ = error.message;

        if (status === 401 || status === 404) {
          message_ = t('USERNAME_OR_PASSWORD_IS_INCORRECT');
        }

        void message.error(message_);
      },
      onSuccess: () => {
        void message.success(t('LOGIN_SUCCESS')).then((): void => navigate('/admin'));
      },
    },
  );
}

export function useUserInfoMutation(): UseMutationResult<UserInfo, Error, void> {
  return useMutation<UserInfo, Error, void>(
    ['getUserInfo'],
    async (): Promise<UserInfo> => {
      const result$: Observable<UserInfo> = fetchUser();

      return await lastValueFrom<UserInfo>(result$);
    },
    {
      onError: (error) => {
        void message.error(error.message);
      },
    },
  );
}
