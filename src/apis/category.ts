import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Category } from 'types/response';

export const fetchCategory = (): Observable<Category[]> => from<Promise<Category[]>>(request.get('/categories'));
