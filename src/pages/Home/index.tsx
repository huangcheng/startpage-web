import { ReactElement, useMemo } from 'react';
import { css } from '@emotion/react';

import { Category, Search } from 'components';
import { useFetchCategoryQuery, useFetchCategorySitesQuery } from 'hooks/request';

import type { Category as CategoryType, CategorySites } from 'types/response';

export default function Home(): ReactElement {
  const { data } = useFetchCategoryQuery();

  const categories = useMemo<CategoryType[]>(() => data ?? [], [data]);

  const { data: categorySites = [] } = useFetchCategorySitesQuery(categories);

  return (
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
  );
}
