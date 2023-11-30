import type { Category } from './response';

export type Pagination = {
  page?: number;
  size?: number;
};

export type User = {
  password: string;
  username: string;
};

export type Password = {
  new_password: string;
  new_password_confirmation: string;
  password: string;
};

export type CreateCategory = Pick<Category, 'name' | 'description' | 'icon'>;

export type UpdateCategory = Pick<Category, 'id'> & Partial<CreateCategory>;
