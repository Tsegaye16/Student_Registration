import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { deleteCourse, getAllCourse } from "../../../redux/action/course";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TableRowSelection } from "antd/es/table/interface";

interface propType {
  onAddCourse: any;
}

const Course: React.FC<propType> = ({ onAddCourse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courses =
    useSelector((state: any) => state.course?.courseData?.result) || [];

  console.log("courses: ", courses);
  // Fetch all courses on component mount
  useEffect(() => {
    dispatch(getAllCourse() as any);
  }, [dispatch]);

  // General delete handler for both single and multiple deletions
  const confirmDelete = async (courseIds: string[]) => {
    console.log("courseIds: ", courseIds);
    const response = await dispatch(deleteCourse(courseIds) as any);
    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      message.success(`${courseIds.length} course(s) deleted successfully`);
    }

    setSelectedRowKeys([]); // Clear selection after deletion
    dispatch(getAllCourse() as any);
  };

  // Columns definition for the course table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price} Birr`, // Format price
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) => `${duration}`, // Format duration
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<InfoCircleOutlined />}
            type="link"
            onClick={() => navigate(`/courses/${record.id}`)}
          >
            Detail
          </Button>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => navigate(`/courses/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => confirmDelete([record.id])} // Send single ID in an array
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              Delete
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
        <h2>Courses</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            onAddCourse(true);
          }}
        >
          Add New Course
        </Button>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {hasSelected && (
          <span>{`Selected ${selectedRowKeys.length} item(s)`}</span>
        )}
        {selectedRowKeys.length === 1 && (
          <Button
            disabled={!hasSelected}
            onClick={() => navigate(`/courses/edit/${selectedRowKeys[0]}`)}
          >
            Edit
          </Button>
        )}
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title="Are you sure you want to delete selected courses?"
            onConfirm={() => confirmDelete(selectedRowKeys as string[])}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete Selected</Button>
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
