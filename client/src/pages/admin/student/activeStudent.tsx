import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, message, Popconfirm, Space, Table, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { TableRowSelection } from "antd/es/table/interface";
import { deleteStudent, getAllStudent } from "../../../redux/action/student";
const { Title } = Typography;

interface props {
  onAddStudent: any;
}

const ActiveStudent: React.FC<props> = ({ onAddStudent }) => {
  const dispatch = useDispatch();
  const students = useSelector(
    (state: any) => state.student?.studentData?.result
  );

  const confirmDelete = async (studentIds: string[]) => {
    const response = await dispatch(deleteStudent(studentIds) as any);
    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      message.success(`${studentIds.length} course(s) deleted successfully`);
      setSelectedRowKeys([]); // Clear selection after deletion
    }

    //dispatch(getAllCourse() as any);
  };

  useEffect(() => {
    dispatch(getAllStudent() as any);
  }, [dispatch]);

  const column = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="link"

            // onClick={(event) => {
            //   event.stopPropagation();
            //   onEditCourse(record);
            // }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this student?"
            onConfirm={() => confirmDelete([record.id])} // Send single ID in an array
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
            <Button type="link" icon={<InfoCircleOutlined />}>
              Detail
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
        <Title level={5}>Student List</Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            onAddStudent(true);
          }}
        >
          Register student
        </Button>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {hasSelected && (
          <span>{`Selected ${selectedRowKeys.length} item(s)`}</span>
        )}

        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title="Are you sure you want to delete selected students?"
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
        columns={column}
        dataSource={students}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ActiveStudent;
