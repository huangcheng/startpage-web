import { css } from '@emotion/react';
import type { FC, ReactElement } from 'react';

export interface LogoProps extends Pick<HTMLImageElement, 'src'> {
  css?: ReturnType<typeof css>;
}

const Logo: FC<LogoProps> = ({ src, css }): ReactElement<LogoProps> => (
  <div
    style={{
      padding: '30px 20px',
    }}
    css={css}
  >
    <img
      src={src}
      alt="logo"
      css={{
        height: 50,
        width: 50,
      }}
    />
  </div>
);

Logo.displayName = 'Logo';

export default Logo;
