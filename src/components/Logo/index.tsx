import { css, useTheme } from '@emotion/react';

import type { FC, ReactElement } from 'react';

import type { Theme } from 'types/theme';

export interface LogoProps extends Pick<HTMLImageElement, 'src'> {
  css?: ReturnType<typeof css>;
}

const Logo: FC<LogoProps> = ({ src, ...rest }): ReactElement<LogoProps> => {
  const theme = useTheme() as Theme;

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        padding: '30px 20px',
      }}
      {...rest}
    >
      <img
        src={src}
        alt="logo"
        css={{
          height: 50,
          width: 50,
        }}
      />
      <div
        css={css`
          color: ${theme.logoColor};
          display: flex;
          flex-direction: column;
          font-size: 26px;
          font-weight: bold;
          height: 64px;
          line-height: 28px;
          margin-left: 12px;
          opacity: 1;

          & > p {
            margin: 0;
          }
        `}
      >
        <p>Start</p>
        <p>Page</p>
      </div>
    </div>
  );
};

Logo.displayName = 'Logo';

export default Logo;
