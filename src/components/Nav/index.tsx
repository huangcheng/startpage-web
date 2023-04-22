import { useMemo } from 'react';
import { css, useTheme } from '@emotion/react';

import type { FC, ReactElement, CSSProperties } from 'react';

import { useFetchCategoryQuery } from 'hooks/request';

import type { Theme } from 'types/theme';
import type { Category } from 'types/response';

export interface NavProps {
  style?: CSSProperties;
}

const Nav: FC<NavProps> = (props: NavProps): ReactElement<NavProps> => {
  const { data } = useFetchCategoryQuery();

  const navItems = useMemo<Category[]>(() => data ?? [], [data]);

  const theme = useTheme() as Theme;

  const { textColor, navActiveColor, navActiveBackgroundColor } = theme;

  return (
    <ul
      css={css`
        list-style: none;
        padding: 0;
        margin: 0;

        & > li {
          font-size: 14px;
          font-weight: 400;
          height: 32px;
          padding: 6px 20px;
          box-sizing: border-box;
          color: ${textColor};
          opacity: 1;
          cursor: pointer;

          &:hover {
            color: ${navActiveColor};
            background-color: ${navActiveBackgroundColor};
          }
        }
      `}
      {...props}
    >
      {navItems.map(({ name, description }) => (
        <li key={name}>{description}</li>
      ))}
    </ul>
  );
};

Nav.displayName = 'Nav';

export default Nav;
