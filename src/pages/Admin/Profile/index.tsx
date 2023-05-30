import { useState } from 'react';
import { css, useTheme, Global } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Upload, Space, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useCookie } from 'react-use';
import { useNavigate } from 'react-router';
import omit from 'lodash-es/omit';

import type { ReactElement } from 'react';
import type { UploadProps } from 'antd';

import { Theme } from 'types/theme';
import { useUser } from 'hooks/store/user';
import { useModifyUserMutation } from 'hooks/request';

import type { UserInfo } from 'types/response';

type UserFormData = Omit<UserInfo, 'roles'>;

const { Item, useForm } = Form;

export default function Profile(): ReactElement {
  const { t } = useTranslation();

  const theme = useTheme() as Theme;
  const user = useUser();
  const [form] = useForm();
  const [token] = useCookie('token');
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const { mutate, isLoading } = useModifyUserMutation();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }

    if (info.file.status === 'done') {
      setImageUrl(info.file.response as string);

      setUploading(false);
    }
  };

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
        {t('PERSONAL_INFORMATION')}
      </h2>
      <Form<UserFormData>
        form={form}
        layout="vertical"
        initialValues={omit<UserInfo>(user, ['password', 'roles']) as unknown as UserFormData}
        onFinish={(values): void =>
          mutate({
            ...(values as UserInfo),
            avatar: imageUrl ?? user?.avatar ?? '',
            username: user?.username ?? '',
          })
        }
      >
        <Item required name="nickname" label={t('NICKNAME')} rules={[{ required: true }]}>
          <Input />
        </Item>
        <Item
          required
          name="password"
          label={t('PASSWORD')}
          rules={[{ message: t('PLEASE_ENTER_YOUR_PASSWORD').toString(), required: true }]}
        >
          <Input type="password" />
        </Item>
        <Item required name="email" label={t('EMAIL')} rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Item>
        <Item label={t('AVATAR')}>
          <Upload
            multiple={false}
            withCredentials={true}
            name="image"
            accept="image/*"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`${API_URI}/user/${user?.username ?? ''}/avatar`}
            method="POST"
            onChange={handleChange}
            headers={{
              Authorization: `Bearer ${token ?? ''}`,
            }}
          >
            {user?.avatar || imageUrl ? (
              <img src={imageUrl ?? user?.avatar} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>{uploading ? <LoadingOutlined /> : <PlusOutlined />}</div>
            )}
          </Upload>
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
