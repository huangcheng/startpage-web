export interface Category {
  children?: Category[];
  description: string;
  icon: string;
  id: number;
  name: string;
}

export interface Site {
  category: string;
  description: string;
  icon: string;
  id: number;
  name: string;
  url: string;
  visit_count: number;
}

export interface UserInfo {
  avatar: string;
  email: string;
  nickname: string;
  username: string;
}

export type CategoryResponse = {
  data: Category[];
  total: number;
};

export interface CategorySites extends Category {
  sites: Site[];
}

export type ApiResponse = CategoryResponse | Category[] | Site[];

export interface SiteWithCategory extends Site {
  category: string;
}

export type SiteResponse = {
  data: SiteWithCategory[];
  total: number;
};
