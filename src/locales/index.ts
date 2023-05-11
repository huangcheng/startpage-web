import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { Resource } from 'i18next';

import cn from './cn';
import en from './en';

export type Language = 'en-US' | 'zh-CN';

export type Translations = Record<string, string>;

const locale: Resource = {
  'en-US': {
    translation: en,
  },
  'zh-CN': {
    translation: cn,
  },
};

const instance = i18n.createInstance({
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
  lng: 'zh-CN',
  resources: locale,
});

void instance.use(initReactI18next).init();

export default instance;
