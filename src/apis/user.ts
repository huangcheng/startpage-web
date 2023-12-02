import { from } from 'rxjs';

import type { Observable } from 'rxjs';

import { request } from 'utils';

import type { Password, User } from 'types/request';
import type { UserInfo } from 'types/response';

export const login = (user: User): Observable<void> => from<Promise<void>>(request.post('/auth/login', user));

export const fetchUser = (): Observable<UserInfo> => from<Promise<UserInfo>>(request.get('/user'));

export const logout = (): Observable<void> => from<Promise<void>>(request.post('/auth/logout'));

export const modifyUser = (username: string, user: UserInfo): Observable<void> =>
  from<Promise<void>>(request.put(`/user/${username}`, user));

export const modifyPassword = (user: string, password: Omit<Password, 'new_password_confirmation'>): Observable<void> =>
  from<Promise<void>>(request.put(`/user/${user}/password`, password));
