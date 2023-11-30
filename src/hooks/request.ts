import { useQuery, useMutation } from 'react-query';
import { lastValueFrom, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

import type { Observable } from 'rxjs';
import type { UseQueryResult, UseMutationResult } from 'react-query';
import type { AxiosError } from 'axios';

import { useDispatch } from 'hooks/store';
import { setUser } from 'reducers/user';
import {
  fetchCategory,
  fetchSitesByCategory,
  login,
  fetchUser,
  logout,
  modifyUser,
  createCategory,
  deleteCategory,
  updateCategory,
} from 'apis';

import type { Category, Site, CategorySites, UserInfo, CategoryResponse } from 'types/response';
import type { User, CreateCategory, UpdateCategory, Pagination } from 'types/request';

export function useFetchCategoryQuery(pagination: Pagination, search?: string): UseQueryResult<CategoryResponse> {
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 10;

  return useQuery<CategoryResponse, Error>(
    ['fetchCategory', page, size, search],
    async (): Promise<CategoryResponse> => {
      const result$: Observable<CategoryResponse> = fetchCategory(page, size, search);

      return await lastValueFrom<CategoryResponse>(result$);
    },
  );
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
        void message.success(t('LOGIN_SUCCESS')).then((): void => {
          window.location.href = '/admin';
        });
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

export function useLogoutMutation(): UseMutationResult<void, Error, void> {
  const { t } = useTranslation();

  return useMutation<void, Error, void>(
    ['logout'],
    async (): Promise<void> => {
      const result$: Observable<void> = logout();

      return await lastValueFrom<void>(result$);
    },
    {
      onSuccess: () => {
        void message.success(t('LOGOUT_SUCCESS')).then((): void => {
          window.location.href = '/login';
        });
      },
    },
  );
}

export function useModifyUserMutation(): UseMutationResult<void, Error, UserInfo> {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return useMutation<void, Error, UserInfo>(
    ['modifyUser'],
    async (user: UserInfo): Promise<void> => {
      const result$: Observable<void> = modifyUser(user);

      return await lastValueFrom<void>(result$);
    },
    {
      onError: (error) => {
        const { response } = error as AxiosError;
        const { status } = response ?? {};

        let message_ = error.message;

        if (status === 401) {
          message_ = t('PASSWORD_IS_INCORRECT');
        }

        void message.error(message_);
      },
      onSuccess: () => {
        void message
          .success(t('PERSONAL_INFORMATION_MODIFY_SUCCESS'))
          .then(() => lastValueFrom(fetchUser()))
          .then((user) => {
            dispatch(setUser(user));
          });
      },
    },
  );
}

export const useCreateCategoryMutation = (): UseMutationResult<void, Error, CreateCategory> => {
  const { t } = useTranslation();

  return useMutation<void, Error, CreateCategory>(
    ['createCategory'],
    async (category: CreateCategory): Promise<void> => {
      const result$ = createCategory(category);

      return await lastValueFrom<void>(result$);
    },
    {
      onError: (error) => {
        const { response } = error as AxiosError;
        const { status } = response ?? {};

        let message_ = t('CREATE_CATEGORY_FAILURE');

        if (status === 409) {
          message_ = t('CATEGORY_ALREADY_EXISTS');
        }

        void message.error(message_);
      },
      onSuccess: () => {
        void message.success(t('CREATE_CATEGORY_SUCCESS'));
      },
    },
  );
};

export const useDeleteCategoryMutation = (): UseMutationResult<void, Error, number> => {
  const { t } = useTranslation();

  return useMutation<void, Error, number>(
    ['deleteCategory'],
    async (id: number): Promise<void> => {
      const result$ = deleteCategory(id);

      return await lastValueFrom<void>(result$);
    },
    {
      onError: () => {
        void message.error(t('DELETE_CATEGORY_FAILURE'));
      },
      onSuccess: () => {
        void message.success(t('DELETE_CATEGORY_SUCCESS'));
      },
    },
  );
};

export const useUpdateCategoryMutation = (): UseMutationResult<void, Error, UpdateCategory> => {
  const { t } = useTranslation();

  return useMutation<void, Error, UpdateCategory>(
    ['updateCategory'],
    async ({ id, ...rest }): Promise<void> => {
      const result$ = updateCategory(id, { ...rest });

      return await lastValueFrom<void>(result$);
    },
    {
      onError: () => {
        void message.error(t('MODIFY_CATEGORY_FAILURE'));
      },
      onSuccess: () => {
        void message.success(t('MODIFY_CATEGORY_SUCCESS'));
      },
    },
  );
};
