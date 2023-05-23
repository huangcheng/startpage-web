import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { User } from 'types/request';
import type { UserInfo } from 'types/response';

export const login = (user: User): Observable<void> => from<Promise<void>>(request.post('/login', user));

export const fetchUser = (): Observable<UserInfo> => from<Promise<UserInfo>>(request.get('/user'));

export const logout = (): Observable<void> => from<Promise<void>>(request.post('/logout'));
