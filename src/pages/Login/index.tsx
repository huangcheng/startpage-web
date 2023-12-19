import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@emotion/react';
import { Form, Button, Input, Select } from 'antd';
import { UserOutlined, LockOutlined, TranslationOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

import type { ReactElement } from 'react';

import { useDispatch, useLocale, useSupportedLocales } from 'hooks/store';
import { setLanguage } from 'reducers/global';
import { useLoginMutation } from 'hooks/request';

import type { Theme } from 'types/theme';
import type { User } from 'types/request';
import type { Language } from 'locales';

import bg from 'assets/images/login_bg.svg';

export default function Login(): ReactElement {
  const theme = useTheme() as Theme;
  const { loginBackgroundColor, backgroundColor } = theme;

  const { t } = useTranslation();

  const { isLoading, mutate, isError } = useLoginMutation();

  const locale = useLocale();
  const supportedLocales = useSupportedLocales();

  const dispatch = useDispatch();

  const [disabled, setDisabled] = useState(false);

  const [form] = Form.useForm();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue] = useLocalStorage('locale', locale as string);

  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (USE_TURNSTILE === true && isError === true && turnstile !== undefined && widget.current !== undefined) {
      setDisabled(false);

      turnstile.reset(widget.current);
    }
  }, [isError, widget]);

  useEffect(() => {
    if (USE_TURNSTILE === true && turnstile !== undefined) {
      turnstile.ready(function () {
        setDisabled(true);

        widget.current = turnstile.render('#cf-turnstile', {
          callback: (token: string) => {
            form.setFieldValue('token', token);

            setDisabled(false);
          },
          language: locale === 'en_US' ? 'auto' : locale.replace(/_/, '-'),
          sitekey: TURNSTILE_SITE_KEY,
        });
      });
    }
  }, [locale, form, setDisabled]);

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
        <Form<User> form={form} size="large" onFinish={mutate}>
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
          {USE_TURNSTILE === true && (
            <Form.Item name="token">
              <div id="cf-turnstile" className="cf-turnstile" style={{ textAlign: 'center' }} />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              disabled={disabled}
              type="primary"
              htmlType="submit"
              style={{ marginTop: 8, width: '100%' }}
              loading={isLoading}
            >
              {t('LOGIN')}
            </Button>
          </Form.Item>
        </Form>
        <Form
          layout="inline"
          style={{ justifyContent: 'center' }}
          initialValues={{ locale }}
          onFinish={(values: { locale: string }) => {
            const { locale } = values;

            dispatch(setLanguage(locale as Language));

            setValue(locale);
          }}
        >
          <Form.Item name="locale" label={<TranslationOutlined />}>
            <Select style={{ width: 200 }}>
              {supportedLocales.map((locale) => (
                <Select.Option key={locale} value={locale}>
                  {t((locale as string).toUpperCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">{t('CHANGE_LANGUAGE')}</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
