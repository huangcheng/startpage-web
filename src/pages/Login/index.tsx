import type { ReactElement } from 'react';
import { useTheme } from '@emotion/react';
import type { Theme } from 'types/theme';

import bg from 'assets/images/login_bg.svg';

export default function Login(): ReactElement {
  const theme = useTheme() as Theme;
  const { loginBackgroundColor, backgroundColor } = theme;

  return (
    <div
      css={{
        alignItems: 'stretch',
        backgroundColor: loginBackgroundColor,
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div css={{ background: `url(${bg}) center no-repeat;`, flex: 'auto' }} />
      <div css={{ backgroundColor, width: '30vw' }}></div>
    </div>
  );
}
