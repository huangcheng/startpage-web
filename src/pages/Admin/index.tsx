import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { Button, Menu } from 'antd';
import { FileTextOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import type { ReactElement } from 'react';

import { useNavs } from 'hooks/store/admin';

import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.png';
import { useTranslation } from 'react-i18next';

export default function Admin(): ReactElement {
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(false);

  const theme = useTheme() as Theme;

  const [navs, setNavs] = useNavs();

  useEffect(() => {
    setNavs([
      {
        icon: <FileTextOutlined />,
        key: 'categories',
        label: t('CATEGORIES') ?? '',
      },
    ]);
  }, [t, setNavs]);

  return (
    <div
      css={{
        alignItems: 'stretch',
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div
        css={{
          backgroundColor: theme.containerBackgroundColor,
          boxSizing: 'border-box',
          padding: '20px 16px',
          width: collapsed ? 112 : 240,
        }}
      >
        <div css={{ alignItems: 'center', display: 'flex', gap: 10, height: 72, marginBottom: 24 }}>
          <img css={{ height: 36, width: 36 }} src={logo} alt="logo" />
          {!collapsed && <h2 css={{ fontSize: '18px', margin: 0 }}>START PAGE</h2>}
        </div>
        <Menu items={navs} defaultSelectedKeys={['categories']} mode="inline" inlineCollapsed={collapsed} />
      </div>
      <div
        css={{
          flex: 'auto',
        }}
      >
        <div>
          <Button type="primary" onClick={(): void => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
      </div>
    </div>
  );
}
