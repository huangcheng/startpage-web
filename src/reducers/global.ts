import { createSlice } from '@reduxjs/toolkit';

import type { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { Themes } from 'types/theme';

export type GlobalState = {
  loading: boolean;
  theme: Themes;
};

const initialState: GlobalState = {
  loading: true,
  theme: 'light',
};

const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    setLoading: (state: Draft<GlobalState>, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state: Draft<GlobalState>, action: PayloadAction<Themes>) => {
      state.theme = action.payload;
    },
  },
});

export const { setLoading, setTheme } = globalSlice.actions;

export type GlobalActions = typeof globalSlice.actions;

export default globalSlice.reducer;
