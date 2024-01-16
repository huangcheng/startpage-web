import { createSlice } from '@reduxjs/toolkit';

import type { Draft, PayloadAction } from '@reduxjs/toolkit';

export type Nav = Record<number, number>;
export type CategorySites = Nav;

export type CategoryState = {
  nav: Nav;
  sites: CategorySites;
};

const initialState: CategoryState = {
  nav: {},
  sites: {},
};

const categorySlice = createSlice({
  initialState,
  name: 'category',
  reducers: {
    setNav: (state: Draft<CategoryState>, action: PayloadAction<Nav>): void => {
      state.nav = action.payload;
    },
    setSites: (state: Draft<CategoryState>, action: PayloadAction<CategorySites>): void => {
      state.sites = action.payload;
    },
  },
});

export const { setNav, setSites } = categorySlice.actions;

export type CategoryActions = typeof categorySlice.actions;

export default categorySlice.reducer;
