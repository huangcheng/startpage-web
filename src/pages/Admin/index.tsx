import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useCookie } from 'react-use';
import { Button, Menu } from 'antd';
import { FileTextOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import type { ReactElement, Key } from 'react';

import { useNavs } from 'hooks/store/admin';

import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.png';

export default function Admin(): ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const theme = useTheme() as Theme;

  const [navs, setNavs] = useNavs();

  const [token] = useCookie('token');

  const icons = useMemo<Record<Key, ReactElement>>(
    () => ({
      categories: <FileTextOutlined />,
    }),
    [],
  );

  useEffect(() => {
    if (token === undefined || (token ?? '').length === 0) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    setNavs([
      {
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
      <motion.div
        layout
        css={{
          backgroundColor: theme.containerBackgroundColor,
          boxSizing: 'border-box',
          padding: '20px 16px',
          width: collapsed ? 112 : 240,
        }}
      >
        <motion.div
          layout
          css={{
            alignItems: 'center',
            display: 'flex',
            gap: 10,
            height: 72,
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginBottom: 24,
          }}
        >
          <img css={{ height: 36, width: 36 }} src={logo} alt="logo" />
          {!collapsed && <h2 css={{ fontSize: '18px', margin: 0 }}>START PAGE</h2>}
        </motion.div>
        <Menu
          items={navs.map((nav) => ({ ...nav, icon: icons[nav.key] }))}
          defaultSelectedKeys={['categories']}
          mode="inline"
          inlineCollapsed={collapsed}
        />
      </motion.div>
      <motion.div
        layout
        css={{
          flex: 'auto',
        }}
      >
        <div>
          <Button type="primary" onClick={(): void => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
