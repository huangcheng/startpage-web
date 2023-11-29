import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Flex, Input, Table, Drawer, Space, Form, Row, Col, Upload, UploadProps } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCookie } from 'react-use';

import type { ReactElement } from 'react';

import { useCreateCategoryMutation } from 'hooks/request';

import type { Category } from 'types/request';

const { Search } = Input;

export default function Category(): ReactElement {
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const [token] = useCookie('token');

  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const createCategoryMutation = useCreateCategoryMutation();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }

    if (info.file.status === 'done') {
      setImageUrl(info.file.response as string);

      setUploading(false);
    }
  };

  useEffect(() => {
    form.setFieldValue('icon', imageUrl);
  }, [imageUrl, form]);

  const columns = useMemo(
    () => [
      {
        dataIndex: 'icon',
        key: 'icon',
        title: t('ICON'),
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: t('NAME'),
      },
      {
        dataIndex: 'description',
        key: 'description',
        title: t('DESCRIPTION'),
      },
      {
        key: 'operation',
        title: t('OPERATION'),
      },
    ],
    [t],
  );

  return (
    <motion.div>
      <Flex justify="space-between">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t('CREATE_CATEGORY')}
        </Button>
        <Search allowClear placeholder={t('PLEASE_ENTER_NAME')} style={{ width: 590 }} />
      </Flex>
      <motion.div css={{ marginTop: 20 }}>
        <Table columns={columns} />
      </motion.div>
      <Drawer
        open={open}
        title={t('CREATE_CATEGORY')}
        extra={
          <Space>
            <Button>{t('CANCEL')}</Button>
            <Button
              type="primary"
              onClick={() => {
                void form
                  .validateFields()
                  .then((values) => {
                    createCategoryMutation.mutate(values as Category);
                  })
                  .catch(() => {});
              }}
            >
              {t('OK')}
            </Button>
          </Space>
        }
        onClose={() => {
          setOpen(false);
        }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                required
                name="name"
                label={t('NAME')}
                rules={[{ message: t('PLEASE_ENTER_NAME'), required: true }]}
              >
                <Input placeholder={t('PLEASE_INPUT')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                required
                name="description"
                label={t('DESCRIPTION')}
                rules={[{ message: t('PLEASE_ENTER_DESCRIPTION'), required: true }]}
              >
                <Input placeholder={t('PLEASE_INPUT')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                required
                name="icon"
                label={t('ICON')}
                rules={[{ message: t('PLEASE_UPLOAD_ICON'), required: true }]}
              >
                <Upload
                  listType="picture"
                  multiple={false}
                  withCredentials={true}
                  accept="image/*"
                  action={`${API_URI}/upload`}
                  method="POST"
                  onChange={handleChange}
                  headers={{
                    Authorization: `Bearer ${token ?? ''}`,
                  }}
                >
                  <Button icon={<UploadOutlined />} disabled={uploading}>
                    {t('UPLOAD_FILE')}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </motion.div>
  );
}
