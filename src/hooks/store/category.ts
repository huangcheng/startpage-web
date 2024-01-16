import { useSelector } from './';

import type { Nav, CategorySites } from 'reducers/category';

export const useNav = (): Nav => useSelector((state) => state.category.nav);

export const useSites = (): CategorySites => useSelector((state) => state.category.sites);
