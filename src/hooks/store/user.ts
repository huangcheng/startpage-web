import { useSelector } from './';

import type { UserInfo } from 'types/response';

export const useUser = (): UserInfo | undefined => useSelector((state) => state.user.user);

export const useIsLogin = (): boolean => {
  const user = useUser();

  return user !== undefined;
};
