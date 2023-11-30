import type { Category } from './response';

export type Pagination = {
  page?: number;
  size?: number;
};

export type User = {
  password: string;
  username: string;
};

export type CreateCategory = Pick<Category, 'name' | 'description' | 'icon'>;

export type UpdateCategory = Pick<Category, 'id'> & Partial<CreateCategory>;
