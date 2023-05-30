import { useCallback } from 'react';

import type { MenuItemType } from 'antd/es/menu/hooks/useItems';

import { setNavs as setAdminNavs } from 'reducers/admin';

import { useSelector, useDispatch } from './';

export const useNavs = (): [MenuItemType[], (navs: MenuItemType[]) => void] => {
  const dispatch = useDispatch();

  const navs = useSelector((state) => state.admin.navs ?? []);

  const setNavs = useCallback(
    (navs: MenuItemType[]) => {
      dispatch(setAdminNavs(navs));
    },
    [dispatch],
  );

  return [navs as MenuItemType[], setNavs];
};
