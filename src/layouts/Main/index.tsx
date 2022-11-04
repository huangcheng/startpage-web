import { css } from '@emotion/react';
import type { PropsWithChildren, ReactElement } from 'react';

export default function Main({ children }: PropsWithChildren): ReactElement<PropsWithChildren> {
  return (
    <main
      css={css`
        flex: auto;
        height: calc(100vh - 40px);
        padding: 30px 52px;
      `}
    >
      {children}
    </main>
  );
}
