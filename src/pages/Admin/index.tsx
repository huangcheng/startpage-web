import { useEffect, useMemo, useState } from 'react';
import { useTheme, Global } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router';
import { useCookie } from 'react-use';
import { Menu } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import type { ReactElement } from 'react';

import { useNavs } from 'hooks/store/admin';
import { Header } from 'components';

import type { Theme } from 'types/theme';

import logo from 'assets/images/logo.png';

type Key = '' | 'site';

export default function Admin(): ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const theme = useTheme() as Theme;

  const [navs, setNavs] = useNavs();

  const [token] = useCookie('token');

  const icons = useMemo<Record<Key, ReactElement>>(
    () => ({
      '': <FileTextOutlined style={{ color: theme.navIconColor }} />,
      site: <FileTextOutlined style={{ color: theme.navIconColor }} />,
    }),
    [theme],
  );

  useEffect(() => {
    if (token === undefined || (token ?? '').length === 0) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    setNavs([
      {
        key: '',
        label: t('CATEGORIES') ?? '',
      },
      {
        key: 'site',
        label: t('NAVIGATION_ITEMS') ?? '',
      },
    ]);
  }, [t, setNavs]);

  return (
    <div
      css={{
        alignItems: 'stretch',
        display: 'flex',
        height: '100vh',
        justifyContent: 'stretch',
        width: '100vw',
      }}
    >
      <Global
        styles={`
        .ant-menu {
          border-inline-end: none !important;
        }

        .ant-menu-light {
          color: ${theme.textColor};
          background-color: ${theme.navBackgroundColor};
         }

        .ant-menu-item.ant-menu-item-selected {
          color: ${theme.textColor};
          background-color: ${theme.navActiveBackgroundColor};
        }
      `}
      />
      <motion.div
        layout
        css={{
          backgroundColor: theme.containerBackgroundColor,
          boxSizing: 'border-box',
          padding: '20px 16px',
          width: collapsed ? 112 : 240,
        }}
        animate={{
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
          <motion.h2
            css={{ fontSize: '18px', margin: 0 }}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : '100%' }}
          >
            START PAGE
          </motion.h2>
        </motion.div>
        <Menu
          items={navs.map((nav) => ({ ...nav, icon: icons[nav.key as Key] }))}
          defaultSelectedKeys={['']}
          mode="inline"
          inlineCollapsed={collapsed}
          onSelect={({ key }) => navigate(key ? `/admin/${key}` : '/admin')}
        />
      </motion.div>
      <div
        css={{
          display: 'flex',
          flex: 'auto',
          flexDirection: 'column',
          justifyContent: 'stretch',
        }}
      >
        <Header collapsed={collapsed} onCollapse={setCollapsed} />
        <div css={{ boxSizing: 'border-box', flex: 'auto', padding: '40px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
