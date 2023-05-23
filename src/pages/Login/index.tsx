import { useTheme } from '@emotion/react';
import { Form, Button, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import type { ReactElement } from 'react';

import { useLoginMutation } from 'hooks/request';

import type { Theme } from 'types/theme';
import type { User } from 'types/request';

import bg from 'assets/images/login_bg.svg';

export default function Login(): ReactElement {
  const theme = useTheme() as Theme;
  const { loginBackgroundColor, backgroundColor } = theme;

  const { t } = useTranslation();

  const { isLoading, mutate } = useLoginMutation();

  return (
    <div
      css={{
        alignItems: 'stretch',
        backgroundColor: loginBackgroundColor,
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div css={{ background: `url(${bg}) center no-repeat;`, flex: 'auto' }} />
      <div
        css={{
          alignItems: 'stretch',
          backgroundColor,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 100px',
          width: '600px',
        }}
      >
        <h2 css={{ fontSize: '28px', lineHeight: '48px', marginBottom: 40, textAlign: 'center' }}>
          {t('WELCOME_TO_LOGIN')}
        </h2>
        <Form<User> size="large" onFinish={mutate}>
          <Form.Item name="username" rules={[{ message: t('PLEASE_ENTER_YOUR_USERNAME').toString(), required: true }]}>
            <Input autoComplete="off" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            required
            name="password"
            rules={[{ message: t('PLEASE_ENTER_YOUR_PASSWORD').toString(), required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: 8, width: '100%' }} loading={isLoading}>
              {t('LOGIN')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
