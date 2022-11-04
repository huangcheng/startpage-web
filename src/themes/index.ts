import type { Theme, Themes as ThemeNames } from 'types/theme';

import light from './light';

export type Themes = Record<ThemeNames, Theme>;

const themes: Themes = {
  light,
};

export default themes;
