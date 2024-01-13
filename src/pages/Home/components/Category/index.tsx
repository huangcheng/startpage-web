import { css, useTheme } from '@emotion/react';
import { useState } from 'react';

import type { FC, ReactElement } from 'react';

import { Site } from 'components';
import { useFetchSitesByCategoryQuery } from 'hooks/request';

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

  const [currentId] = useState(() => {
    if (children !== null && children.length > 0) {
      return children[0].id;
    }

    return id;
  });

  const { data: sites = [] } = useFetchSitesByCategoryQuery(currentId, search);

  const theme = useTheme() as Theme;

  const { textColor } = theme;

  return (
    <section
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
      <div
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
      </div>
    </section>
  );
};

Category.displayName = 'Category';

export default Category;
