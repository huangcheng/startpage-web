export interface Category {
  description: string;
  id: string;
  name: string;
}

export interface Site {
  description: string;
  icon: string;
  id: string;
  name: string;
  url: string;
}

export interface UserInfo {
  avatar: string;
  email: string;
  nickname: string;
  roles: string[];
  username: string;
}

export interface CategorySites extends Category {
  sites: Site[];
}

export type ApiResponse = Category[] | Site[];
