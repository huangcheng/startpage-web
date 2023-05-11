import type { RouteObject } from 'react-router';

import { load } from 'utils/route';

const routes: RouteObject[] = [
  {
    element: load('Home'),
    path: '/',
  },
  {
    element: load('Login'),
    path: '/login',
  },
];

export default routes;
