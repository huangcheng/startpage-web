import { css } from '@emotion/react';
import type { CSSProperties, PropsWithChildren, ReactElement } from 'react';

export type HeadProps = {
  style?: CSSProperties;
};

export default function Head({
  children,
  style = {},
}: PropsWithChildren<HeadProps>): ReactElement<PropsWithChildren<HeadProps>> {
  return (
    <header
      style={{
        ...style,
      }}
      css={css`
        height: 40px;
        box-sizing: border-box;
      `}
    >
      {children}
    </header>
  );
}
