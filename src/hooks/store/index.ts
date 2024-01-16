import { useDispatch as _useDispatch, useSelector as _useSelector } from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from '../../store';

export { useLocale, useSupportedLocales } from './global';

export { useNav, useSites } from './category';

export const useDispatch = (): AppDispatch => _useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
