import type { ReducersMapObject } from '@reduxjs/toolkit';

import globalReducer from './global';
import userReducer from './user';

import type { GlobalState } from './global';
import type { UserState } from './user';

type State = {
  global: GlobalState;
  user: UserState;
};

const reducer: ReducersMapObject<State> = {
  global: globalReducer,
  user: userReducer,
};

export default reducer;
