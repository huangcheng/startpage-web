import { forwardRef } from 'react';
import { css } from '@emotion/react';

import type { PropsWithChildren, CSSProperties } from 'react';

export interface MainProps {
  style?: CSSProperties;
}

const Main = forwardRef<HTMLElement, PropsWithChildren<MainProps>>((prop, ref) => {
  const { children, style } = prop;

  return (
    <main
      css={css`
        flex: auto;
        padding: 30px 52px;
        box-sizing: border-box;
        height: calc(100vh - 60px);
        overflow-y: auto;
      `}
      style={style}
      ref={ref}
    >
      {children}
    </main>
  );
});

Main.displayName = 'Main';

export default Main;
