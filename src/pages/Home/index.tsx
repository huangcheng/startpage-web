import { useMemo, useRef } from 'react';
import { css, useTheme } from '@emotion/react';

import type { ReactElement } from 'react';

import { MainContent, Side } from 'layouts';
import { Category, Logo, Nav, Search, Header } from 'components';
import { useFetchCategoriesQuery, useFetchCategorySitesQuery } from 'hooks/request';

import type { Category as CategoryType, CategorySites } from 'types/response';
import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.png';

export default function Home(): ReactElement {
  const theme = useTheme() as Theme;
  const { containerBackgroundColor } = theme;

  const { data } = useFetchCategoriesQuery({ page: 0, size: 1000 });

  const categories = useMemo<CategoryType[]>(() => data?.data ?? [], [data]);

  const { data: categorySites = [] } = useFetchCategorySitesQuery(categories);

  const ref = useRef<HTMLElement | null>(null);

  return (
    <div
      css={css`
        align-content: stretch;
        display: flex;
        height: 100vh;
        width: 100vw;
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
            paddingLeft: 10,
          }}
          items={categorySites
            .filter(({ sites }) => sites.length > 0)
            .map(({ icon, id, name, description }) => ({
              description,
              icon,
              id,
              name,
            }))}
          getContainer={(): HTMLElement | Window => ref.current ?? window}
        />
      </Side>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex: auto;
          height: 100vh;
        `}
      >
        <Header />
        <MainContent ref={ref}>
          <div
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
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
                flex: auto;
              `}
            >
              {categorySites
                .map(({ icon, name, description, sites }: CategorySites): ReactElement | undefined =>
                  sites.length > 0 ? (
                    <Category key={name} icon={icon} id={name} sites={sites} title={description} />
                  ) : undefined,
                )
                .filter(Boolean)}
            </div>
          </div>
        </MainContent>
      </div>
    </div>
  );
}
