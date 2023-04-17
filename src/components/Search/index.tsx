import { css, useTheme } from '@emotion/react';
import type { FC, ReactElement } from 'react';

import search from 'assets/images/search.png';

import type { Theme } from 'types/theme';

const Search: FC = (): ReactElement => {
  const theme = useTheme() as Theme;

  return (
    <div
      css={css`
        position: relative;
        background-color: ${theme.searchBackgroundColor};
        height: 140px;
        width: 100%;
      `}
    >
      <img
        src={search}
        alt="search"
        css={css`
          position: absolute;
          width: 234px;
          height: 155px;
          top: 0;
          right: 32px;
        `}
      />
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
