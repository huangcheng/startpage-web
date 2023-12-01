import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import { Button, Flex, Input, Table, Drawer, Space, Form, Row, Col, Upload, Divider, Popconfirm, Select } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCookie } from 'react-use';

import type { ReactElement } from 'react';
import type { UploadProps } from 'antd';

import {
  useCreateSiteMutation,
  useDeleteSiteMutation,
  useFetchCategoriesQuery,
  useFetchSitesQuery,
  useUpdateSiteMutation,
} from 'hooks/request';

import type { CreateSite, Pagination, UpdateSite } from 'types/request';
import type { Category, SiteWithCategory } from 'types/response';
import type { Theme } from 'types/theme';

const { Search } = Input;

export default function Site(): ReactElement {
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

  const { data: categoryResponse } = useFetchCategoriesQuery({ page: 0, size: 1000 });
  const { data, isLoading, refetch } = useFetchSitesQuery(pagination, search);

  const createSiteMutation = useCreateSiteMutation();
  const deleteSiteMutation = useDeleteSiteMutation();
  const updateSiteMutation = useUpdateSiteMutation();

  const categories = useMemo(() => categoryResponse?.data ?? [], [categoryResponse]);

  useEffect(() => {
    if (createSiteMutation.isSuccess || deleteSiteMutation.isSuccess || updateSiteMutation.isSuccess) {
      void refetch();
    }
  }, [createSiteMutation.isSuccess, deleteSiteMutation.isSuccess, updateSiteMutation.isSuccess, refetch]);

  const handleChange: UploadProps['onChange'] = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    if (info.file.status === 'uploading') {
      setUploading(true);
    }

    if (info.file.status === 'done') {
      form.setFieldValue('icon', info.file.response as string);

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
        dataIndex: 'url',
        key: 'url',
        title: t('URL'),
      },
      {
        dataIndex: 'category',
        key: 'category',
        title: t('CATEGORY'),
      },
      {
        key: 'operation',
        render: ({ id, name, category: category_name, description, icon, url }: SiteWithCategory) => (
          <Flex gap={10} css={{ color: theme.navIconColor }}>
            <EditOutlined
              onClick={() => {
                setIsUpdate(true);
                setId(id);
                setFileList([]);

                const category = categories.find(({ name }) => name === category_name)?.id;

                form.setFieldsValue({
                  category,
                  description,
                  icon,
                  name,
                  url,
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
                void deleteSiteMutation.mutate(id);
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
    [deleteSiteMutation, t, theme.navIconColor, setIsUpdate, setId, setOpen, form, setFileList, categories],
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
            setFileList([]);

            setOpen(true);
          }}
        >
          {t('CREATE_SITE')}
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
        title={t(`${isUpdate ? 'MODIFY' : 'CREATE'}_SITE`)}
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
                      void updateSiteMutation.mutate({ id, ...values } as UpdateSite);
                    } else {
                      createSiteMutation.mutate(values as CreateSite);
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
                name="url"
                label={t('URL')}
                rules={isUpdate ? [{ type: 'url' }] : [{ message: t('PLEASE_ENTER_URL'), required: true, type: 'url' }]}
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
                name="category"
                label={t('CATEGORY')}
                rules={isUpdate ? [] : [{ message: t('PLEASE_SELECT_CATEGORY'), required: true }]}
                hasFeedback={!isUpdate}
              >
                <Select placeholder={t('PLEASE_SELECT')}>
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
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
