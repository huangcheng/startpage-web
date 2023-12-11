import {
  Children,
  cloneElement,
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  type HTMLAttributes,
} from 'react';
import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import {
  Button,
  Flex,
  Input,
  Table,
  Drawer,
  Space,
  Form,
  Row,
  Col,
  Upload,
  Divider,
  Popconfirm,
  Select,
  message,
} from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCookie } from 'react-use';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import isString from 'lodash-es/isString';

import type { UploadProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DragEndEvent } from '@dnd-kit/core';

import {
  useCreateSiteMutation,
  useDeleteSiteMutation,
  useFetchCategoriesQuery,
  useFetchSitesQuery,
  useUpdateSiteMutation,
  useFetchSitesByCategoryQuery,
  useSortCategorySitesMutation,
} from 'hooks/request';

import type { CreateSite, Pagination, UpdateSite } from 'types/request';
import type { SiteWithCategory } from 'types/response';
import type { Theme } from 'types/theme';

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

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
  const [filter, setFilter] = useState<number | undefined>(undefined);

  const [token] = useCookie('token');

  const [form] = Form.useForm();

  const { data: categoryResponse } = useFetchCategoriesQuery({ page: 0, size: 10_000 });
  const { data, isLoading, refetch } = useFetchSitesQuery(pagination, search);
  const { data: categorySites = [], refetch: refreshSites } = useFetchSitesByCategoryQuery(filter, search);

  const createSiteMutation = useCreateSiteMutation();
  const deleteSiteMutation = useDeleteSiteMutation();
  const updateSiteMutation = useUpdateSiteMutation();
  const sortCategorySitesMutation = useSortCategorySitesMutation();

  const categories = useMemo(() => categoryResponse?.data ?? [], [categoryResponse?.data]);

  const sites = useMemo(() => {
    if (filter) {
      return categorySites
        .map((site) => ({
          ...site,
          category: categories.find(({ id }) => id === filter)?.name ?? '',
        }))
        .filter(({ category }) => category !== '');
    }

    return data?.data ?? [];
  }, [data?.data, categorySites, categories, filter]);

  useEffect(() => {
    if (createSiteMutation.isSuccess || deleteSiteMutation.isSuccess || updateSiteMutation.isSuccess) {
      void refetch();
    }
  }, [createSiteMutation.isSuccess, deleteSiteMutation.isSuccess, updateSiteMutation.isSuccess, refetch]);

  useEffect(() => {
    if (createSiteMutation.isSuccess || updateSiteMutation.isSuccess) {
      setOpen(false);
    }
  }, [createSiteMutation.isSuccess, updateSiteMutation.isSuccess, setOpen]);

  useEffect(() => {
    if (sortCategorySitesMutation.isSuccess) {
      void refreshSites();
    }
  }, [sortCategorySitesMutation.isSuccess, refreshSites]);

  const handleChange: UploadProps['onChange'] = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    switch (info.file.status) {
      case 'uploading': {
        setUploading(true);

        break;
      }
      case 'done': {
        form.setFieldValue('icon', info.file.response as string);

        setUploading(false);

        break;
      }
      case 'error': {
        setUploading(false);

        let messageText = t('UPLOAD_FAILED');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (info.file.error?.status === 413) {
          messageText = t('FILE_IS_TOO_LARGE');
        }

        void message.error(messageText);

        break;
      }
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

  const RowElement = ({ children, ...props }: RowProps): ReactElement => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
      id: props['data-row-key'],
    });

    const style: CSSProperties = {
      ...props.style,
      transform: CSS.Transform.toString(transform),
      transition,
      ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {Children.map(children, (child) => {
          if ((child as ReactElement).key === 'sort' && filter !== undefined) {
            return cloneElement(child as ReactElement, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ cursor: 'move', touchAction: 'none' }}
                  {...listeners}
                />
              ),
            });
          }

          return child;
        })}
      </tr>
    );
  };

  const columns = useMemo(
    () =>
      [
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
          filterMultiple: false,
          filters: categories.map(({ name, id }) => ({ text: name, value: id })),
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
        filter === undefined
          ? undefined
          : {
              key: 'sort',
              width: '5%',
            },
      ].filter(Boolean),
    [deleteSiteMutation, t, theme.navIconColor, setIsUpdate, setId, setOpen, form, categories, filter, setFileList],
  );

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    if (active.id !== over?.id && filter !== undefined) {
      sortCategorySitesMutation.mutate({
        active: active.id as number,
        id: filter,
        over: over?.id as number,
      });
    }
  };

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
      <motion.div css={{ marginTop: 20, position: 'relative', zIndex: 1 }}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext items={data?.data.map(({ id }) => id) ?? []} strategy={verticalListSortingStrategy}>
            <Table<SiteWithCategory>
              rowKey="id"
              columns={columns as ColumnsType<SiteWithCategory>}
              components={{
                body: {
                  row: RowElement,
                },
              }}
              dataSource={sites}
              loading={isLoading}
              pagination={
                filter === undefined
                  ? {
                      current: (pagination.page ?? 0) + 1,
                      onChange: (page, size): void => {
                        setPagination({ page: page - 1, size });
                      },
                      pageSize: pagination.size,
                      total: data?.total ?? 0,
                    }
                  : false
              }
              onChange={(_, filters) => {
                setFilter(filters.category?.[0] as number);
              }}
            />
          </SortableContext>
        </DndContext>
      </motion.div>
      <Drawer
        open={open}
        title={t(`${isUpdate ? 'MODIFY' : 'CREATE'}_SITE`)}
        extra={
          <Space>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {t('CANCEL')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                void form
                  .validateFields()
                  .then((values: Record<string, string>) => {
                    for (const key of Object.keys(values)) {
                      if (isString(values[key])) {
                        values[key] = values[key].trim();
                      }
                    }

                    if (isUpdate) {
                      void updateSiteMutation.mutate({ id, ...values } as UpdateSite);
                    } else {
                      createSiteMutation.mutate(values as unknown as CreateSite);
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
                required
                name="name"
                label={t('NAME')}
                rules={[{ message: t('PLEASE_ENTER_NAME'), required: true }]}
                hasFeedback
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
                hasFeedback
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
                hasFeedback
              >
                <Input placeholder={t('PLEASE_INPUT')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                required
                name="category"
                label={t('CATEGORY')}
                rules={[{ message: t('PLEASE_SELECT_CATEGORY'), required: true }]}
                hasFeedback
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
                required
                name="icon"
                label={t('ICON')}
                rules={[{ message: t('PLEASE_UPLOAD_ICON'), required: true }]}
                hasFeedback
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
