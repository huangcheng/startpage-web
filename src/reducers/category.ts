import { createSlice } from '@reduxjs/toolkit';

import type { Draft, PayloadAction } from '@reduxjs/toolkit';

export type Nav = Record<number, number>;

export type CategoryState = {
  nav: Nav;
};

const initialState: CategoryState = {
  nav: {},
};

const categorySlice = createSlice({
  initialState,
  name: 'category',
  reducers: {
    setNav: (state: Draft<CategoryState>, action: PayloadAction<Nav>): void => {
      state.nav = action.payload;
    },
  },
});

export const { setNav } = categorySlice.actions;

export type CategoryActions = typeof categorySlice.actions;

export default categorySlice.reducer;
