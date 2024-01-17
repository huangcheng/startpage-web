import type { ReducersMapObject } from '@reduxjs/toolkit';

import globalReducer from './global';
import userReducer from './user';
import adminReducer from './admin';
import categoryReducer from './category';
import siteReducer from './site';

import type { GlobalState } from './global';
import type { UserState } from './user';
import type { AdminState } from './admin';
import type { CategoryState } from './category';
import type { SiteState } from './site';

type State = {
  admin: AdminState;
  category: CategoryState;
  global: GlobalState;
  site: SiteState;
  user: UserState;
};

const reducer: ReducersMapObject<State> = {
  admin: adminReducer,
  category: categoryReducer,
  global: globalReducer,
  site: siteReducer,
  user: userReducer,
};

export default reducer;
