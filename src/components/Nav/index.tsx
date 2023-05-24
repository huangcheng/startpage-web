import { Anchor } from 'antd';

import type { FC, ReactElement, CSSProperties } from 'react';

import type { Category } from 'types/response';

export interface NavProps {
  getContainer?: () => HTMLElement | Window;
  items: Category[];
  style?: CSSProperties;
}

const Nav: FC<NavProps> = (props: NavProps): ReactElement<NavProps> => {
  const { items, getContainer, ...rest } = props;

  return (
    <div {...rest}>
      <Anchor
        affix={false}
        getContainer={getContainer}
        items={items.map(({ name, description }) => ({
          href: `#${name}`,
          key: name,
          title: description,
        }))}
      />
    </div>
  );
};

Nav.displayName = 'Nav';

export default Nav;
