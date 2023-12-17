import { createSlice } from '@reduxjs/toolkit';

import type { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { Themes } from 'types/theme';

import type { Language } from '../locales';

export type GlobalState = {
  loading: boolean;
  locale: Language;
  locales: Language[];
  theme: Themes;
};

const initialState: GlobalState = {
  loading: true,
  locale: 'zh_CN',
  locales: ['zh_CN', 'en_US'],
  theme: 'light',
};

const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    setLanguage: (state: Draft<GlobalState>, action: PayloadAction<Language>) => {
      state.locale = action.payload;
    },
    setLoading: (state: Draft<GlobalState>, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state: Draft<GlobalState>, action: PayloadAction<Themes>) => {
      state.theme = action.payload;
    },
  },
});

export const { setLoading, setTheme, setLanguage } = globalSlice.actions;

export type GlobalActions = typeof globalSlice.actions;

export default globalSlice.reducer;
