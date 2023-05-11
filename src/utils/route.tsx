import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

import type { ComponentType } from 'react';

type ESModule<T> = T & { default: T };

export const load = (page: string): JSX.Element => {
  const Component = lazy(
    (): Promise<ESModule<ComponentType>> => import(`../pages/${page}`) as unknown as Promise<ESModule<ComponentType>>,
  );

  return (
    <Suspense fallback={<Spin spinning size="large" delay={500} style={{ height: '100vh', width: '100vw' }} />}>
      <Component />
    </Suspense>
  );
};
