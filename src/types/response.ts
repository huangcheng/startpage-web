export interface Response {
  code: number;
  message: string;
}

export type Category = {
  description: string;
  id: number;
  name: string;
};

export type FetchCategoryResult = {
  data: Category[];
  total: number;
};

export type FetchCategoryResponse = Response & FetchCategoryResult;

export type Site = {
  description: string;
  icon: string;
  id: number;
  name: string;
  url: string;
};

export type FetchSitesByCategoryResult = {
  data: Site[];
  total: number;
};

export type FetchSitesByCategoryResponse = Response & FetchSitesByCategoryResult;

export type ApiResponse = FetchCategoryResponse | FetchSitesByCategoryResponse;
