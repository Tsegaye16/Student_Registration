import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Space, Popconfirm, message, Typography } from "antd";
import { deleteCourse, getAllCourse } from "../../../redux/action/course";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TableRowSelection } from "antd/es/table/interface";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

interface propType {
  onAddCourse: any;
  onEditCourse: any;
}

const Course: React.FC<propType> = ({ onAddCourse, onEditCourse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const courses = useSelector((state: any) => state.course?.courseData);
  //console.log("courses: ", courses);
  // General delete handler for both single and multiple deletions
  const confirmDelete = async (courseIds: string[]) => {
    const response = await dispatch(deleteCourse(courseIds) as any);
    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      message.success(`${courseIds.length} course(s) deleted successfully`);
      setSelectedRowKeys([]); // Clear selection after deletion
    }

    //dispatch(getAllCourse() as any);
  };
  // Fetch all courses on component mount
  useEffect(() => {
    dispatch(getAllCourse() as any);
  }, [dispatch]);

  // Columns definition for the course table
  const columns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Price"),
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price} ${t("Birr")}`, // Format price
    },
    {
      title: t("Duration"),
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) => {
        const [number, unit] = duration.split(" ");
        return `${number} ${t(unit)}`;
      }, // Format duration
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="link"
            //onClick={() => navigate(`/courses/edit/${record.id}`)}
            onClick={(event) => {
              event.stopPropagation();
              onEditCourse(record);
            }}
          >
            {t("Edit")}
          </Button>
          <Popconfirm
            title={t("Are you sure you want to delete this course?")}
            onConfirm={() => confirmDelete([record._id])} // Send single ID in an array
            okText={t("Yes")}
            cancelText={t("No")}
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              {t("Delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Title level={5}>{t("Course")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            onAddCourse(true);
          }}
        >
          {t("Add New Course")}
        </Button>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {hasSelected && (
          <span>{`Selected ${selectedRowKeys.length} item(s)`}</span>
        )}

        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title={t("Are you sure you want to delete selected courses?")}
            onConfirm={() => confirmDelete(selectedRowKeys as string[])}
            okText={t("Yes")}
            cancelText={t("No")}
          >
            <Button danger>{t("Delete Selected")}</Button>
          </Popconfirm>
        )}
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={courses}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Course;
