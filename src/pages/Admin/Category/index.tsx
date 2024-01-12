import { useEffect, useMemo, useState, Children, cloneElement } from 'react';
import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import { Button, Flex, Input, Table, Drawer, Space, Form, Row, Col, Upload, Divider, Popconfirm, message } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCookie } from 'react-use';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import isString from 'lodash-es/isString';

import type { ReactElement, HTMLAttributes, CSSProperties } from 'react';
import type { UploadProps } from 'antd';
import type { DragEndEvent } from '@dnd-kit/core';

import {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useSortCategoriesMutation,
} from 'hooks/request';

import type { CreateCategory, UpdateCategory } from 'types/request';
import type { Category } from 'types/response';
import type { Theme } from 'types/theme';

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const { Search } = Input;

export default function Category(): ReactElement {
  const { t } = useTranslation();

  const theme = useTheme() as Theme;

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [fileList, setFileList] = useState<UploadProps['fileList']>([]);

  const [token] = useCookie('token');

  const [form] = Form.useForm();

  const createCategoryMutation = useCreateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const sortCategoriesMutation = useSortCategoriesMutation();

  const { data, isLoading, refetch } = useFetchCategoriesQuery({ page: 0, size: 10_000 }, search);

  useEffect(() => {
    if (
      createCategoryMutation.isSuccess ||
      deleteCategoryMutation.isSuccess ||
      updateCategoryMutation.isSuccess ||
      sortCategoriesMutation.isSuccess
    ) {
      void refetch();
    }
  }, [
    createCategoryMutation.isSuccess,
    deleteCategoryMutation.isSuccess,
    updateCategoryMutation.isSuccess,
    sortCategoriesMutation.isSuccess,
    refetch,
  ]);

  useEffect(() => {
    if (createCategoryMutation.isSuccess || updateCategoryMutation.isSuccess) {
      setOpen(false);
    }
  }, [createCategoryMutation.isSuccess, updateCategoryMutation.isSuccess, setOpen]);

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
          if ((child as ReactElement).key === 'sort') {
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
                setFileList([]);

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
      {
        key: 'sort',
        width: '5%',
      },
    ],
    [deleteCategoryMutation, t, theme.navIconColor, setIsUpdate, setId, setOpen, form, setFileList],
  );

  const expandedRowRender = (record: Category): ReactElement => {
    const { children = [] } = record;

    return (
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={children.map(({ id }) => id) ?? []} strategy={verticalListSortingStrategy}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={children}
            pagination={false}
            components={{
              body: {
                row: RowElement,
              },
            }}
          />
        </SortableContext>
      </DndContext>
    );
  };

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    if (active.id !== over?.id) {
      sortCategoriesMutation.mutate({
        active: active.id as number,
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
          {t('CREATE_CATEGORY')}
        </Button>
        <Search
          allowClear
          placeholder={t('PLEASE_ENTER_NAME')}
          style={{ width: 590 }}
          onSearch={(value: string) => setSearch(value)}
        />
      </Flex>
      <motion.div
        css={{
          height: 'calc(100vh - 60px - 40px - 32px -' + ' 40px)',
          marginTop: 20,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext items={data?.data.map(({ id }) => id) ?? []} strategy={verticalListSortingStrategy}>
            <Table<Category>
              rowKey="id"
              columns={columns}
              components={{
                body: {
                  row: RowElement,
                },
              }}
              dataSource={data?.data ?? []}
              loading={isLoading}
              pagination={false}
              expandable={{
                childrenColumnName: 'other',
                expandedRowRender,
                rowExpandable: (record) => Boolean(record.children && record.children.length > 0),
              }}
            />
          </SortableContext>
        </DndContext>
      </motion.div>
      <Drawer
        open={open}
        title={t(`${isUpdate ? 'MODIFY' : 'CREATE'}_CATEGORY`)}
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
                  .then((values: CreateCategory) => {
                    const data: CreateCategory = { ...values };
                    for (const key of Object.keys(values)) {
                      let value = values[key as keyof CreateCategory];

                      if (isString(value)) {
                        value = value.trim();
                      }

                      data[key as keyof CreateCategory] = value;
                    }

                    if (isUpdate) {
                      void updateCategoryMutation.mutate({ id, ...data } as UpdateCategory);
                    } else {
                      createCategoryMutation.mutate(data);
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
