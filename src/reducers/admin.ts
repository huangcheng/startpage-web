import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Draft } from '@reduxjs/toolkit';
import type { MenuItemType } from 'antd/es/menu/hooks/useItems';

export type AdminState = {
  navs?: MenuItemType[];
};

const initialState: AdminState = {
  navs: [],
};

const adminSlice = createSlice({
  initialState,
  name: 'admin',
  reducers: {
    setNavs: (state: Draft<AdminState>, action: PayloadAction<MenuItemType[]>) => {
      state.navs = action.payload;
    },
  },
});

export const { setNavs } = adminSlice.actions;

export type AdminActions = typeof adminSlice.actions;

export default adminSlice.reducer;
