import { useMemo } from 'react';
import { css, useTheme } from '@emotion/react';

import type { FC, ReactElement } from 'react';

import { useFetchCategorySitesQuery } from 'hooks/request';
import { Site } from 'components';

import folder from 'assets/images/icons/folder.png';

import type { Theme } from 'types/theme';
import type { Site as SiteType } from 'types/response';

export interface CategoryProps {
  id: number;
  title: string;
}

const Category: FC<CategoryProps> = (props: CategoryProps): ReactElement<CategoryProps> => {
  const { id, title } = props;

  const theme = useTheme() as Theme;

  const { textColor } = theme;

  const { data } = useFetchCategorySitesQuery(id);

  const sites = useMemo<SiteType[]>(() => data?.data ?? [], [data]);

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
        <img src={folder} alt={title} />
        <span
          css={css`
            margin-left: 8px;
          `}
        >
          {title}
        </span>
      </title>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: 24px;
          row-gap: 20px;
          margin-top: 24px;
        `}
      >
        {sites.map(
          ({ id, url, description, name, icon }: SiteType): ReactElement => (
            <Site key={id} icon={icon} title={name} link={url} description={description} />
          ),
        )}
      </div>
    </section>
  );
};

Category.displayName = 'Category';

export default Category;
