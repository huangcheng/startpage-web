import { css } from '@emotion/react';

import type { FC, ReactElement } from 'react';

export interface LogoProps extends Pick<HTMLImageElement, 'src'> {
  css?: ReturnType<typeof css>;
}

const Logo: FC<LogoProps> = ({ src, ...rest }): ReactElement<LogoProps> => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        padding: '30px 20px',
      }}
      {...rest}
    >
      <img src={src} alt="logo" width="100%" height="100%" />
    </div>
  );
};

Logo.displayName = 'Logo';

export default Logo;
