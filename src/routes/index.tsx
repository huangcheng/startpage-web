import type { RouteObject } from 'react-router-dom';

import { load } from 'utils/route';

const routes: RouteObject[] = [
  {
    element: load('NotFound'),
    path: '*',
  },
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
        element: load('Admin/Password'),
        path: 'password',
      },
      {
        element: load('Admin/Category'),
        path: 'category',
      },
      {
        element: load('Admin/Site'),
        path: 'site',
      },
    ],
    element: load('Admin'),
    path: '/admin',
  },
];

export default routes;
