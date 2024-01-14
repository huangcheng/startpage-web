import type { ReducersMapObject } from '@reduxjs/toolkit';

import globalReducer from './global';
import userReducer from './user';
import adminReducer from './admin';
import categoryReducer from './category';

import type { GlobalState } from './global';
import type { UserState } from './user';
import type { AdminState } from './admin';
import type { CategoryState } from './category';

type State = {
  admin: AdminState;
  category: CategoryState;
  global: GlobalState;
  user: UserState;
};

const reducer: ReducersMapObject<State> = {
  admin: adminReducer,
  category: categoryReducer,
  global: globalReducer,
  user: userReducer,
};

export default reducer;
