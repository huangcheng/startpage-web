import { createSlice } from '@reduxjs/toolkit';

import type { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { UserInfo } from 'types/response';

export type UserState = {
  user?: UserInfo;
};

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    setUser: (state: Draft<UserState>, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export type UserActions = typeof userSlice.actions;

export default userSlice.reducer;
