import { css } from '@emotion/react';
import { Search } from 'components';

export default function Home(): JSX.Element {
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
