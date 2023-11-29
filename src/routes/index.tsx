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
  {
    children: [
      {
        element: load('Admin/Profile'),
        path: 'profile',
      },
      {
        element: load('Admin/Category'),
        path: 'category',
      },
    ],
    element: load('Admin'),
    path: '/admin',
  },
];

export default routes;
