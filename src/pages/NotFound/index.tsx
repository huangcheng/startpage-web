import { Flex } from 'antd';

import type { ReactElement } from 'react';

import image from 'assets/images/404.svg';

export default function NotFound(): ReactElement {
  return (
    <Flex
      style={{
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        width: '100vw',
      }}
    >
      <img src={image} alt="404" width="50%" height="50%" />
    </Flex>
  );
}
