export type pages = 'home' | 'login' | 'admin';

export type Theme = Record<
  | 'loginBackgroundColor'
  | 'siteBackgroundColor'
  | 'textColor'
  | 'titleColor'
  | 'backgroundColor'
  | 'containerBackgroundColor'
  | 'borderColor'
  | 'searchBackgroundColor'
  | 'navActiveColor'
  | 'navActiveBackgroundColor'
  | 'navBackgroundColor'
  | 'navIconColor'
  | 'logoColor',
  string
>;
export type Themes = 'light';
