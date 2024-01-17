import { createSlice } from '@reduxjs/toolkit';

import type { Draft, PayloadAction } from '@reduxjs/toolkit';

export type SiteAnalytics = Record<number, number>;

export type SiteState = {
  analytics: SiteAnalytics;
};

const SITE_ANALYTICS_KEY = 'site_visit_analytics';

const initialState: SiteState = {
  analytics: (localStorage.getItem(SITE_ANALYTICS_KEY)
    ? JSON.parse(localStorage.getItem(SITE_ANALYTICS_KEY) as string)
    : {}) as SiteAnalytics,
};

const siteSlice = createSlice({
  initialState,
  name: 'site',
  reducers: {
    setSiteAnalytics: (state: Draft<SiteState>, action: PayloadAction<SiteAnalytics>): void => {
      state.analytics = action.payload;

      localStorage.setItem(SITE_ANALYTICS_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { setSiteAnalytics } = siteSlice.actions;

export type SiteActions = typeof siteSlice.actions;

export default siteSlice.reducer;
