import { useSelector } from './';
import type { Language } from '../../locales';

export const useLocale = (): Language => useSelector((state) => state.global.locale);
