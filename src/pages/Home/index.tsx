import { ReactElement, useMemo } from 'react';
import { css, useTheme } from '@emotion/react';

import { Head, MainContent, Side } from 'layouts';
import { Category, Logo, Nav, Search } from 'components';
import { useFetchCategoryQuery, useFetchCategorySitesQuery } from 'hooks/request';

import type { Category as CategoryType, CategorySites } from 'types/response';
import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.png';

export default function Home(): ReactElement {
  const theme = useTheme() as Theme;
  const { containerBackgroundColor, borderColor } = theme;

  const { data } = useFetchCategoryQuery();

  const categories = useMemo<CategoryType[]>(() => data ?? [], [data]);

  const { data: categorySites = [] } = useFetchCategorySitesQuery(categories);

  return (
    <div
      css={css`
        align-content: stretch;
        display: flex;
      `}
    >
      <Side
        style={{
          backgroundColor: containerBackgroundColor,
        }}
      >
        <Logo src={logo} />
        <Nav
          style={{
            marginTop: 10,
          }}
        />
      </Side>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex: auto;
        `}
      >
        <Head
          style={{
            borderBottom: `1px solid ${borderColor}`,
          }}
        />
        <MainContent>
          {' '}
          <div>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              <Search />
            </div>
            <div
              css={css`
                margin-top: 60px;
              `}
            >
              {categorySites
                .map(({ name, description, sites }: CategorySites): ReactElement | undefined =>
                  sites.length > 0 ? <Category key={name} sites={sites} title={description} /> : undefined,
                )
                .filter(Boolean)}
            </div>
          </div>
        </MainContent>
      </div>
    </div>
  );
}
