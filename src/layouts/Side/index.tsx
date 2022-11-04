import { css } from '@emotion/react';

import type { ReactElement, PropsWithChildren, CSSProperties } from 'react';

type SideProps = {
  style?: CSSProperties;
  width?: CSSProperties['width'];
};

export default function Side({
  children,
  width = 220,
  style = {},
}: PropsWithChildren<SideProps>): ReactElement<PropsWithChildren<SideProps>> {
  return (
    <aside
      style={{
        width,
        ...style,
      }}
      css={css`
        height: 100vh;
      `}
    >
      {children}
    </aside>
  );
}
