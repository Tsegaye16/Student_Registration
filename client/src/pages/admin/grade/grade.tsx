import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrade, updateGrade } from "../../../redux/action/grade";
import { Table, Input, Button } from "antd";
import { useTranslation } from "react-i18next";

const Grade = () => {
  const dispatch = useDispatch();
  const students = useSelector((state: any) => state.grade?.grade);
  const { t } = useTranslation();

  const [editingKey, setEditingKey] = useState<string>("null");
  const [updatedData, setUpdatedData] = useState<any>({});

  useEffect(() => {
    dispatch(getGrade() as any);
  }, [dispatch]);

  const isEditing = (record: any) => record.id === editingKey;

  const handleEdit = (record: any) => {
    setEditingKey(record.id);

    setUpdatedData(record.examScores); // Set the initial examScores for the row being edited
    //setUpdatedData({ ...record.examScores, id: record.id });
  };

  const handleSave = async (id: string) => {
    // Dispatch an action or call an API to save the updated data
    const response = await dispatch(
      updateGrade({ id: editingKey, data: updatedData }) as any
    );

    setEditingKey(""); // Exit editing mode
  };

  const handleCancel = () => {
    setEditingKey(""); // Exit editing mode without saving
    setUpdatedData({});
  };

  const handleChange = (key: string, value: any) => {
    setUpdatedData({ ...updatedData, [key]: Number(value) });
  };

  const columns = [
    {
      title: t("Student Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Written Exam"),
      dataIndex: ["examScores", "writenExam"],
      key: "writenExam",
      render: (text: any, record: any) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={updatedData.writenExam}
            min={0}
            onChange={(e) => handleChange("writenExam", Number(e.target.value))}
          />
        ) : (
          text
        ),
    },
    {
      title: t("Practice Exam"),
      dataIndex: ["examScores", "practiceExam"],
      key: "practiceExam",
      render: (text: any, record: any) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={updatedData.practiceExam}
            min={0}
            onChange={(e) =>
              handleChange("practiceExam", Number(e.target.value))
            }
          />
        ) : (
          text
        ),
    },
    {
      title: t("Exit Exam"),
      dataIndex: ["examScores", "exitExam"],
      key: "exitExam",
      render: (text: any, record: any) =>
        isEditing(record) ? (
          <Input
            type="number"
            value={updatedData.exitExam}
            onChange={(e) => handleChange("exitExam", Number(e.target.value))}
            min={0}
          />
        ) : (
          text
        ),
    },
    {
      title: t("Total Result"),
      key: "total",
      render: (_: any, record: any) => {
        const { practiceExam, writenExam, exitExam } = record.examScores;
        return (Number(practiceExam) + Number(writenExam)).toFixed(2);
      },
    },
    {
      title: t("Action"),
      key: "action",
      render: (_: any, record: any) =>
        isEditing(record) ? (
          <>
            <Button
              type="link"
              onClick={() => handleSave(record.id)}
              style={{ marginRight: 8 }}
            >
              {t("Save")}
            </Button>
            <Button type="link" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </>
        ) : (
          <Button type="link" onClick={() => handleEdit(record)}>
            {t("Edit")}
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Grade;
