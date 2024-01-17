import { useSelector } from './';

import type { SiteAnalytics } from 'reducers/site';

export const useSiteAnalytics = (): SiteAnalytics => useSelector((state) => state.site.analytics);
