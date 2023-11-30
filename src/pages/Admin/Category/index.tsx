import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import { Button, Flex, Input, Table, Drawer, Space, Form, Row, Col, Upload, Divider, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCookie } from 'react-use';

import type { ReactElement } from 'react';
import type { UploadProps } from 'antd';

import {
  useCreateCategoryMutation,
  useFetchCategoryQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from 'hooks/request';

import type { Pagination, UpdateCategory } from 'types/request';
import type { Category } from 'types/response';
import type { Theme } from 'types/theme';

const { Search } = Input;

export default function Category(): ReactElement {
  const { t } = useTranslation();

  const theme = useTheme() as Theme;

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 10 });
  const [search, setSearch] = useState<string>('');
  const [fileList, setFileList] = useState<UploadProps['fileList']>([]);

  const [token] = useCookie('token');

  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const createCategoryMutation = useCreateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();

  const { data, isLoading, refetch } = useFetchCategoryQuery(pagination, search);

  useEffect(() => {
    if (createCategoryMutation.isSuccess || deleteCategoryMutation.isSuccess || updateCategoryMutation.isSuccess) {
      void refetch();
    }
  }, [createCategoryMutation.isSuccess, deleteCategoryMutation.isSuccess, updateCategoryMutation.isSuccess, refetch]);

  const handleChange: UploadProps['onChange'] = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    if (info.file.status === 'uploading') {
      setUploading(true);
    }

    if (info.file.status === 'done') {
      setImageUrl(info.file.response as string);

      setUploading(false);
    }

    fileList = fileList.map((file) => {
      if (file.response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        file.url = file.response.url;
      }

      return file;
    });

    setFileList(fileList);
  };

  useEffect(() => {
    form.setFieldValue('icon', imageUrl);
  }, [imageUrl, form]);

  const columns = useMemo(
    () => [
      {
        dataIndex: 'icon',
        key: 'icon',
        render: (icon: string) => <img src={icon} alt="icon" width={24} height={24} />,
        title: t('ICON'),
        width: '5%',
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: t('NAME'),
        width: '30%',
      },
      {
        dataIndex: 'description',
        key: 'description',
        title: t('DESCRIPTION'),
      },
      {
        key: 'operation',
        render: ({ id, name, description, icon }: Category) => (
          <Flex gap={10} css={{ color: theme.navIconColor }}>
            <EditOutlined
              onClick={() => {
                setIsUpdate(true);
                setId(id);
                setImageUrl(icon);

                form.setFieldsValue({
                  description,
                  icon,
                  name,
                });

                setOpen(true);
              }}
            />
            <Divider type="vertical" />
            <Popconfirm
              placement="top"
              title={t('ARE_YOU_SURE_TO_DELETE')}
              okText={t('OK')}
              cancelText={t('CANCEL')}
              onConfirm={() => {
                void deleteCategoryMutation.mutate(id);
              }}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Flex>
        ),
        title: t('OPERATION'),
        width: '5%',
      },
    ],
    [deleteCategoryMutation, t, theme.navIconColor, setIsUpdate, setId, setOpen, form, setImageUrl],
  );

  return (
    <motion.div>
      <Flex justify="space-between">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsUpdate(false);
            form.resetFields();

            setOpen(true);
          }}
        >
          {t('CREATE_CATEGORY')}
        </Button>
        <Search
          allowClear
          placeholder={t('PLEASE_ENTER_NAME')}
          style={{ width: 590 }}
          onSearch={(value: string) => setSearch(value)}
        />
      </Flex>
      <motion.div css={{ marginTop: 20 }}>
        <Table<Category>
          rowKey="id"
          columns={columns}
          dataSource={data?.data ?? []}
          loading={isLoading}
          pagination={{
            current: (pagination.page ?? 0) + 1,
            onChange: (page, size) => {
              setPagination({ page: page - 1, size });
            },
            pageSize: pagination.size,
            total: data?.total ?? 0,
          }}
        />
      </motion.div>
      <Drawer
        open={open}
        title={t(`${isUpdate ? 'MODIFY' : 'CREATE'}_CATEGORY`)}
        extra={
          <Space>
            <Button>{t('CANCEL')}</Button>
            <Button
              type="primary"
              onClick={() => {
                void form
                  .validateFields()
                  .then((values) => {
                    if (isUpdate) {
                      void updateCategoryMutation.mutate({ id, ...values } as UpdateCategory);
                    } else {
                      createCategoryMutation.mutate(values as Category);
                    }
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
                required={!isUpdate}
                name="name"
                label={t('NAME')}
                rules={isUpdate ? [] : [{ message: t('PLEASE_ENTER_NAME'), required: true }]}
                hasFeedback={!isUpdate}
              >
                <Input placeholder={t('PLEASE_INPUT')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                required={!isUpdate}
                name="description"
                label={t('DESCRIPTION')}
                rules={isUpdate ? [] : [{ message: t('PLEASE_ENTER_DESCRIPTION'), required: true }]}
                hasFeedback={!isUpdate}
              >
                <Input placeholder={t('PLEASE_INPUT')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                required={!isUpdate}
                name="icon"
                label={t('ICON')}
                rules={isUpdate ? [] : [{ message: t('PLEASE_UPLOAD_ICON'), required: true }]}
                hasFeedback={!isUpdate}
              >
                <Upload
                  fileList={fileList}
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
