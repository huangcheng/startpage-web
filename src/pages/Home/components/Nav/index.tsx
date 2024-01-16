import { Anchor } from 'antd';

import type { FC, ReactElement, CSSProperties } from 'react';
import type { AnchorLinkItemProps } from 'antd/lib/anchor/Anchor';

import { useSites } from 'hooks/store';

import type { Category } from 'types/response';

export interface NavProps {
  getContainer?: () => HTMLElement | Window;
  items: Category[];
  onClick?: (id: string) => void;
  style?: CSSProperties;
}

const buildNavItems = (categories: Category[], parentId?: number): AnchorLinkItemProps[] =>
  categories.map(({ id, name, icon, children }) => ({
    children: buildNavItems(children ?? [], id),
    href: parentId ? `#${parentId}-${id}` : `#${id}`,
    key: id,
    title: (
      <div css={{ alignItems: 'center', display: 'flex' }}>
        <img src={icon} width="14px" height="14px" style={{ marginRight: 6 }} alt={name} /> {name}
      </div>
    ),
  }));

const Nav: FC<NavProps> = (props: NavProps): ReactElement<NavProps> => {
  const { items, onClick, getContainer, ...rest } = props;

  const sites = useSites();

  return (
    <div {...rest}>
      <Anchor
        affix={false}
        getContainer={getContainer}
        items={buildNavItems(items.filter(({ id }) => sites[id] > 0))}
        onClick={(_, link) => {
          onClick?.(link.href.replace('#', ''));
        }}
      />
    </div>
  );
};

Nav.displayName = 'Nav';

export default Nav;
