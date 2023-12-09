import { css, useTheme } from '@emotion/react';
import { Input } from 'antd';

import type { FC, ReactElement } from 'react';
import type { SearchProps } from 'antd/lib/input';

import search from 'assets/images/search.png';

import type { Theme } from 'types/theme';

const { Search: AntdSearch } = Input;

const Search: FC<SearchProps> = (props: SearchProps): ReactElement<SearchProps> => {
  const theme = useTheme() as Theme;

  return (
    <div
      css={css`
        align-items: center;
        background-color: ${theme.searchBackgroundColor};
        display: flex;
        justify-content: center;
        height: 140px;
        position: relative;
        width: 100%;
      `}
    >
      <AntdSearch style={{ position: 'relative', width: '50%', zIndex: 1 }} {...props} />
      <img
        src={search}
        alt="search"
        css={css`
          position: absolute;
          width: 234px;
          height: 155px;
          top: 0;
          right: 32px;
          z-index: 0;
        `}
      />
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
