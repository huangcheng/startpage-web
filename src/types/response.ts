export interface Category {
  description: string;
  id: number;
  name: string;
}

export interface Site {
  description: string;
  icon: string;
  id: number;
  name: string;
  url: string;
}

export interface CategorySites extends Category {
  sites: Site[];
}

export type ApiResponse = Category[] | Site[];
