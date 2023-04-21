import { ReactElement, useMemo } from 'react';
import { css } from '@emotion/react';

import { Search, Category } from 'components';
import { useFetchCategoryQuery } from 'hooks/request';

import type { Category as CategoryType } from 'types/response';

export default function Home(): JSX.Element {
  const { data } = useFetchCategoryQuery();

  const categories = useMemo<CategoryType[]>(() => data?.data ?? [], [data]);

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
        {categories.map(
          ({ description, id }: CategoryType): ReactElement => (
            <Category id={id} title={description} key={id} />
          ),
        )}
      </div>
    </div>
  );
}
