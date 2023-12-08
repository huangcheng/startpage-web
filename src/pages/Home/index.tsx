import { useMemo, useRef, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

import type { ReactElement } from 'react';

import { MainContent, Side } from 'layouts';
import { Category, Logo, Nav, Search, Header } from 'components';
import { useFetchCategoriesQuery, useFetchCategorySitesQuery } from 'hooks/request';

import type { Category as CategoryType, CategorySites } from 'types/response';
import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.svg';

export default function Home(): ReactElement {
  const theme = useTheme() as Theme;
  const { containerBackgroundColor } = theme;

  const { t } = useTranslation();

  const { data } = useFetchCategoriesQuery({ page: 0, size: 10_000 });

  const categories = useMemo<CategoryType[]>(() => data?.data ?? [], [data]);

  const [search, setSearch] = useState('');

  const ref = useRef<HTMLElement | null>(null);

  const { data: categorySites = [] } = useFetchCategorySitesQuery(categories, search);

  const navWidth = 220;

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
        width={navWidth}
      >
        <div css={{ position: 'relative', width: navWidth }}>
          <Logo src={logo} />
          <Nav
            style={{
              marginTop: 10,
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
        </div>
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
                align-items: center;
                display: flex;
                flex-direction: column;
              `}
            >
              <Search
                placeholder={t('PLEASE_ENTER_KEYWORDS_TO_SEARCH')}
                onSearch={(value) => {
                  setSearch(value);
                }}
              />
            </div>
            <div
              css={css`
                margin-top: 60px;
                flex: auto;
              `}
            >
              {categorySites
                .map(({ icon, name, sites }: CategorySites): ReactElement | undefined =>
                  sites.length > 0 ? (
                    <Category key={name} icon={icon} id={name} sites={sites} title={name} />
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
