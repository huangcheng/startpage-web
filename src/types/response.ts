export interface Response {
  code: number;
  message: string;
}

export type Category = {
  description: string;
  name: string;
};

export type FetchCategoryResult = {
  data: Category[];
  total: number;
};

export type FetchCategoryResponse = Response & FetchCategoryResult;
