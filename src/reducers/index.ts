import type { ReducersMapObject } from '@reduxjs/toolkit';

import globalReducer from './global';
import userReducer from './user';
import adminReducer from './admin';

import type { GlobalState } from './global';
import type { UserState } from './user';
import type { AdminState } from './admin';

type State = {
  admin: AdminState;
  global: GlobalState;
  user: UserState;
};

const reducer: ReducersMapObject<State> = {
  admin: adminReducer,
  global: globalReducer,
  user: userReducer,
};

export default reducer;
