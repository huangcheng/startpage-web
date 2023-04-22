export type Category = {
  description: string;
  id: number;
  name: string;
};

export type Site = {
  description: string;
  icon: string;
  id: number;
  name: string;
  url: string;
};

export type CategorySites = Category & {
  sites: Site[];
};

export type ApiResponse = Category[] | Site[];
