import { css, useTheme } from '@emotion/react';
import { Segmented } from 'antd';

import type { FC, ReactElement } from 'react';

import { Site } from 'components';
import { useDispatch, useNav } from 'hooks/store';
import { useFetchSitesByCategoryQuery } from 'hooks/request';
import { setNav } from 'reducers/category';

import type { Theme } from 'types/theme';
import type { Category, Site as SiteType } from 'types/response';

export interface CategoryProps {
  category: Category;
  onClick?: (site: number) => void;
  search?: string;
}

const Category: FC<CategoryProps> = (props: CategoryProps): ReactElement<CategoryProps> => {
  const { category, search, onClick } = props;

  const { id, icon, name, children = [] } = category;

  const nav = useNav();

  const activatedId = nav[id];

  const { data: sites = [] } = useFetchSitesByCategoryQuery(activatedId, search);

  const theme = useTheme() as Theme;

  const { textColor } = theme;

  const dispatch = useDispatch();

  return (
    <section
      id={`${id}`}
      css={css`
        margin-bottom: 48px;
      `}
    >
      <title
        css={css`
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
          line-height: 28px;
          color: ${textColor};
        `}
      >
        <img src={icon} alt={name} width={20} height={20} />
        <span
          css={css`
            margin-left: 8px;
          `}
        >
          {name}
        </span>
      </title>
      {children !== null && children.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <Segmented
            value={activatedId}
            options={children.map(({ id, name, description, icon }) => ({
              icon: (
                <img
                  css={css`
                    display: inline-flex;
                    align-items: center;
                    color: inherit;
                    font-style: normal;
                    line-height: 0;
                    text-align: center;
                    text-transform: none;
                    vertical-align: -0.125em;
                    text-rendering: optimizeLegibility;
                  `}
                  src={icon}
                  alt={description}
                  width={14}
                  height={14}
                />
              ),
              // eslint-disable-next-line unicorn/consistent-destructuring
              label: <span id={`${category.id}-${id}`}>{name}</span>,
              value: id,
            }))}
            onChange={(value): void => {
              dispatch(setNav({ ...nav, [id]: value as number }));
            }}
          />
        </section>
      )}
      <section
        css={css`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          align-items: flex-start;
          margin-top: 24px;
        `}
      >
        {sites.map(
          ({ id, url, description, name, icon }: SiteType): ReactElement => (
            <Site
              key={id}
              icon={icon}
              title={name}
              link={url}
              description={description}
              onClick={() => onClick?.(id)}
            />
          ),
        )}
      </section>
    </section>
  );
};

Category.displayName = 'Category';

export default Category;
