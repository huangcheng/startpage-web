import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Space, Dropdown } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons';

import type { FC, ReactElement } from 'react';
import type { MenuProps } from 'antd';

import { Head } from 'layouts';

import { useUser } from 'hooks/store/user';
import { useLogoutMutation } from 'hooks/request';

import type { Theme } from 'types/theme';

export interface HeaderProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Header: FC<HeaderProps> = (props: HeaderProps): ReactElement<HeaderProps> => {
  const { collapsed, onCollapse } = props;

  const { t } = useTranslation();
  const { mutate } = useLogoutMutation();
  const navigate = useNavigate();

  const theme = useTheme() as Theme;
  const user = useUser();

  const items = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'settings',
        label: (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <span onClick={(): void => navigate('/admin/profile')}>{t('PERSONAL_SETTINGS')}</span>
        ),
      },
      {
        key: 'password',
        label: (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <span onClick={(): void => navigate('/admin/password')}>{t('MODIFY_PASSWORD')}</span>
        ),
      },
      {
        key: 'logout',
        label: (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <span
            onClick={(): void => {
              mutate();
            }}
          >
            {t('LOGOUT')}
          </span>
        ),
      },
    ],
    [mutate, t, navigate],
  );

  return (
    <Head
      style={{
        borderBottom: `1px solid ${theme.borderColor}`,
        boxSizing: 'border-box',
        height: 60,
        padding: '0 24px',
        width: '100%',
      }}
    >
      <div
        css={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'stretch',
          width: '100%',
        }}
      >
        {collapsed !== undefined && (
          <Button
            type="text"
            style={{
              alignItems: 'center',
              display: 'flex',
              height: 32,
              justifyContent: 'center',
              width: 32,
            }}
            onClick={(): void => onCollapse?.(!collapsed)}
          >
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: '24px' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: '24px' }} />
            )}
          </Button>
        )}
        {user && (
          <div css={{ flex: 'auto', textAlign: 'right' }}>
            <Space>
              <Avatar
                icon={!user?.avatar && <UserOutlined />}
                src={user?.avatar && user?.avatar?.length > 0 ? user.avatar : undefined}
              />
              <Dropdown menu={{ items }}>
                <Space>
                  <div style={{ cursor: 'pointer' }}>
                    <Space>
                      <span>{user.nickname}</span>
                      <DownOutlined />
                    </Space>
                  </div>
                </Space>
              </Dropdown>
            </Space>
          </div>
        )}
      </div>
    </Head>
  );
};

export default Header;
