export type pages = 'home' | 'login' | 'admin';

export type Theme = Record<
  | 'loginBackgroundColor'
  | 'siteBackgroundColor'
  | 'textColor'
  | 'backgroundColor'
  | 'containerBackgroundColor'
  | 'borderColor'
  | 'searchBackgroundColor'
  | 'navActiveColor'
  | 'navActiveBackgroundColor'
  | 'logoColor',
  string
>;
export type Themes = 'light';
