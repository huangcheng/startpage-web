import { lazy, Suspense } from 'react';
import { Spin, Flex } from 'antd';

import type { ComponentType } from 'react';

type ESModule<T> = T & { default: T };

export const load = (page: string): JSX.Element => {
  const Component = lazy(
    (): Promise<ESModule<ComponentType>> => import(`../pages/${page}`) as unknown as Promise<ESModule<ComponentType>>,
  );

  return (
    <Suspense
      fallback={
        <Flex
          style={{
            alignItems: 'center',
            height: '100vh',
            justifyContent: 'center',
            width: '100vw',
          }}
        >
          <Spin size="large" />
        </Flex>
      }
    >
      <Component />
    </Suspense>
  );
};
