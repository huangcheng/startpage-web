import { useMemo } from 'react';
import { css } from '@emotion/react';

import type { FC, ReactElement, ReactNode } from 'react';

export interface LogoProps extends Pick<HTMLImageElement, 'src'> {
  css?: ReturnType<typeof css>;
  href?: string;
}

const Logo: FC<LogoProps> = ({ src, href, ...rest }): ReactElement<LogoProps> => {
  const logo = useMemo<ReactNode>(() => <img src={src} alt="logo" width="100%" height="100%" />, [src]);

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        padding: '30px 20px',
      }}
      {...rest}
    >
      {href ? <a href={href}>{logo}</a> : logo}
    </div>
  );
};

Logo.displayName = 'Logo';

export default Logo;
