import { useSelector } from './';

import type { Nav } from 'reducers/category';

export const useNav = (): Nav => useSelector((state) => state.category.nav);
