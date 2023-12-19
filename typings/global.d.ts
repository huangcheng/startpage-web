import type { RootState } from '../src/store';

interface Turnstile {
  ready: (callback: () => void) => void;

  render: (
    element: string,
    options: { callback: (string) => void; language: string; sitekey: string },
  ) => string | undefined;

  reset: (widgetId: string) => void;
}

declare global {
  export type State = RootState;

  declare const ENV: string;

  declare const API_URI: string;

  declare const USE_TURNSTILE: boolean;

  declare const TURNSTILE_SITE_KEY: string;

  declare const turnstile: Turnstile;
}
