import { useMemo, useRef, useState } from 'react';
import { css, useTheme, Global } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { BrowserView } from 'react-device-detect';

import type { ReactElement } from 'react';

import { MainContent, Side } from 'layouts';
import { Category, Logo, Nav, Search, Header } from 'components';
import { useFetchCategoriesQuery, useFetchCategorySitesQuery } from 'hooks/request';
import { useIsLogin } from 'hooks/store/user';

import type { Category as CategoryType, CategorySites } from 'types/response';
import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.svg';

export default function Home(): ReactElement {
  const theme = useTheme() as Theme;
  const { containerBackgroundColor, navActiveColor } = theme;

  const { t } = useTranslation();

  const { data } = useFetchCategoriesQuery({ page: 0, size: 10_000 });

  const categories = useMemo<CategoryType[]>(() => data?.data ?? [], [data]);

  const [search, setSearch] = useState('');

  const ref = useRef<HTMLElement | null>(null);

  const { data: categorySites = [] } = useFetchCategorySitesQuery(categories, search);

  const isLogin = useIsLogin();

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
      <Global
        styles={css`
          .ant-anchor::before {
            display: none !important;
          }

          .ant-anchor .ant-anchor-ink {
            inset-inline-start: unset !important;

            inset-inline-end: 0 !important;

            background-color: ${navActiveColor} !important;
          }

          .ant-anchor .ant-anchor-link {
            padding-block: 6px !important;
          }

          .ant-anchor-link-active {
            background-color: rgba(240, 240, 240, 0.27) !important;
          }

          .ant-anchor .ant-anchor-link-active > .ant-anchor-link-title {
            color: ${navActiveColor} !important;
          }
        `}
      />
      <BrowserView>
        <Side
          style={{
            backgroundColor: containerBackgroundColor,
            height: '100%',
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
      </BrowserView>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex: auto;
          height: 100vh;
        `}
      >
        {isLogin && <Header />}
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
                    <Category
                      key={name}
                      icon={icon}
                      id={name}
                      sites={sites}
                      title={name}
                      onClick={(id: number): void => {
                        navigator.sendBeacon(`/api/site/${id}/visit`);
                      }}
                    />
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
