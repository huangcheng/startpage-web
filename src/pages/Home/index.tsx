import { css } from '@emotion/react';

import { Search } from 'components';
import { useFetchCategoryQuery } from 'hooks/request';

export default function Home(): JSX.Element {
  const categoryQuery = useFetchCategoryQuery();

  // eslint-disable-next-line no-console
  console.log(categoryQuery?.data);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Search />
    </div>
  );
}
