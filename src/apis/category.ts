import { from } from 'rxjs';
import omitBy from 'lodash-es/omitBy';
import isEmpty from 'lodash-es/isEmpty';

import type { Observable } from 'rxjs';
import type { AxiosResponse } from 'axios';

import { request } from 'utils';

import type { CategoryResponse } from 'types/response';
import type { CreateCategory, UpdateCategory } from 'types/request';

export const fetchCategories = (page: number, size: number, search?: string): Observable<CategoryResponse> => {
  let query = `/categories?page=${page}&size=${size}`;

  if (search && search.length > 0) {
    query += `&search=${search}`;
  }

  return from<Promise<CategoryResponse>>(
    request
      .get(query)
      .then<CategoryResponse>(
        (response: AxiosResponse<CategoryResponse>): CategoryResponse => response as unknown as CategoryResponse,
      ),
  );
};

export const createCategory = (category: CreateCategory): Observable<void> =>
  from<Promise<void>>(request.post('/category', category));

export const deleteCategory = (id: number): Observable<void> => from<Promise<void>>(request.delete(`/category/${id}`));

export const updateCategory = (id: number, category: Omit<UpdateCategory, 'id'>): Observable<void> =>
  from<Promise<void>>(request.put(`/category/${id}`, omitBy(category, isEmpty)));
