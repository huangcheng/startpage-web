import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Draft } from '@reduxjs/toolkit';
import type { MenuProps } from 'antd';

export type AdminState = {
  navs?: MenuProps['items'];
};

const initialState: AdminState = {
  navs: [],
};

const adminSlice = createSlice({
  initialState,
  name: 'admin',
  reducers: {
    setNavs: (state: Draft<AdminState>, action: PayloadAction<MenuProps['items']>) => {
      state.navs = action.payload;
    },
  },
});

export const { setNavs } = adminSlice.actions;

export type AdminActions = typeof adminSlice.actions;

export default adminSlice.reducer;
