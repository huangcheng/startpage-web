import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { User } from 'types/request';

export const login = (user: User): Observable<void> => from<Promise<void>>(request.post('/login', user));
