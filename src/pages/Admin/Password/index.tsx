import { css, useTheme, Global } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import omit from 'lodash-es/omit';
import isString from 'lodash-es/isString';

import type { ReactElement } from 'react';

import { Theme } from 'types/theme';
import { useUser } from 'hooks/store/user';
import { useModifyPasswordMutation } from 'hooks/request';

import type { Password } from 'types/request';
import type { UserInfo } from 'types/response';

type UserFormData = Omit<UserInfo, 'roles'>;

const { Item, useForm } = Form;

export default function Password(): ReactElement {
  const { t } = useTranslation();

  const theme = useTheme() as Theme;

  const user = useUser();
  const [form] = useForm();
  const navigate = useNavigate();

  const { mutate, isLoading } = useModifyPasswordMutation();

  return (
    <div
      css={css`
        box-shadow: 0px 2px 8px rgba(171, 176, 185, 0.4);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 637px;
        justify-content: stretch;
        margin: 120px auto 0 auto;
        padding: 36px 30px;
        width: 560px;
      `}
    >
      <Global
        styles={`
        .ant-form {
          flex: auto;
        }

        .ant-upload-wrapper {
          text-align: left;
        }

        .ant-space {
          justify-content: center;
        }
      `}
      />
      <h2
        css={css`
          color: ${theme.titleColor};
          font-size: 24px;
          margin: 0;
          text-align: center;
        `}
      >
        {t('PASSWORD')}
      </h2>
      <Form<Password>
        form={form}
        layout="vertical"
        initialValues={omit<UserInfo>(user, ['password', 'roles']) as unknown as UserFormData}
        onFinish={(values): void => {
          if (user !== undefined) {
            for (const key of Object.keys(values)) {
              if (isString(values[key as keyof Password])) {
                values[key as keyof Password] = values[key as keyof Password].trim();
              }
            }

            mutate({
              password: {
                ...omit(values, ['new_password_confirmation']),
              },
              user: user.username,
            });
          }
        }}
      >
        <Item
          required
          name="password"
          label={t('PASSWORD')}
          rules={[{ message: t('PLEASE_ENTER_YOUR_PASSWORD').toString(), required: true }]}
        >
          <Input type="password" />
        </Item>
        <Item
          required
          name="new_password"
          label={t('NEW_PASSWORD')}
          rules={[{ message: t('PLEASE_ENTER_YOUR_NEW_PASSWORD').toString(), required: true }]}
        >
          <Input type="password" />
        </Item>
        <Item
          required
          name="new_password_confirmation"
          label={t('NEW_PASSWORD_CONFIRMATION')}
          rules={[
            { message: t('PLEASE_CONFIRM_YOUR_NEW_PASSWORD').toString(), required: true },
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            ({ getFieldValue }) => ({
              // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('NEW_PASSWORD_MISMATCH').toString()));
              },
            }),
          ]}
        >
          <Input type="password" />
        </Item>
      </Form>
      <Space align="center" size="large">
        <Button onClick={(): void => navigate(-1)}>{t('CANCEL')}</Button>
        <Button type="primary" loading={isLoading} onClick={(): void => form.submit()}>
          {t('SAVE')}
        </Button>
      </Space>
    </div>
  );
}
