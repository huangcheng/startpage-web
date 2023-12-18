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
        items={items.map(({ name, icon }) => ({
          href: `#${name}`,
          key: name,
          title: (
            <div css={{ alignItems: 'center', display: 'flex' }}>
              <img src={icon} width="14px" height="14px" style={{ marginRight: 6 }} alt={name} /> {name}
            </div>
          ),
        }))}
      />
    </div>
  );
};

Nav.displayName = 'Nav';

export default Nav;
