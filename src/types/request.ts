import type { Category, Site } from './response';

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

export type CreateCategory = Omit<Category, 'id'>;

export type UpdateCategory = Pick<Category, 'id'> & Partial<CreateCategory>;

export type CreateSite = Omit<Site, 'id' | 'category'> & { category: number };

export type UpdateSite = Pick<Site, 'id'> & Partial<CreateSite>;

export type SortCategories = {
  active: number;
  over?: number;
};
