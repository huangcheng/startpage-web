import { from } from 'rxjs';

import type { Observable } from 'rxjs';
import type { AxiosResponse } from 'axios';

import { request } from 'utils';

import type { CategoryResponse } from 'types/response';
import type { CreateCategory, UpdateCategory } from 'types/request';

export const fetchCategory = (page: number, size: number, search?: string): Observable<CategoryResponse> => {
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

export const updateCategory = (id: number, category: Omit<UpdateCategory, 'id'>): Observable<void> => {
  if (category.icon === undefined || category.icon.length === 0) {
    delete category.icon;
  }

  if (category.description === undefined || category.description.length === 0) {
    delete category.description;
  }

  if (category.name === undefined || category.name.length === 0) {
    delete category.name;
  }

  return from<Promise<void>>(request.put(`/category/${id}`, category));
};
