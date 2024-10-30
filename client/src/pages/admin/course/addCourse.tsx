import React, { useState } from "react";
import { Input, Button, Select, Form, Typography, message } from "antd";
import { useDispatch } from "react-redux";

import { addCourse } from "../../../redux/action/course";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Title } = Typography;

interface propType {
  onSave: any;
}
const AddCourse: React.FC<propType> = ({ onSave }) => {
  const [courseData, setCourseData] = useState({
    name: "",
    price: "",
    duration: "",
  });
  const [durationType, setDurationType] = useState("hour");

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleDurationTypeChange = (value: any) => {
    setDurationType(value);
  };

  const handleSave = async () => {
    const fullDuration = `${courseData.duration} ${durationType}`;
    const finalData = { ...courseData, duration: fullDuration };

    const response = await dispatch(addCourse(finalData) as any);
    console.log("response error: ", response);
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      onSave();
    } else if (response?.error) {
      if (response.payload.includes(":")) {
        message.error(`${response.payload.split(":")[1]?.trim()}`);
      } else {
        message.error(response.payload); // or handle it another way if `:` is not present
      }
    }
  };

  const handleCancel = () => {
    setCourseData({
      name: "",
      price: "",
      duration: "",
    });
    setDurationType("hour");
    onSave();
  };

  return (
    <div style={styles.container}>
      <Title level={3} style={styles.title}>
        {t("Add New Course")}
      </Title>
      <Form layout="vertical" style={styles.form}>
        <Form.Item label={t("Course Name")} style={styles.formItem}>
          <Input
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            placeholder={t("Enter course name")}
            style={styles.input}
          />
        </Form.Item>

        <Form.Item label={t("Price")} style={styles.formItem}>
          <Input
            name="price"
            value={courseData.price}
            onChange={handleInputChange}
            placeholder={t("Enter course price")}
            type="number"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item label={t("Duration")} style={styles.formItem}>
          <div style={styles.durationContainer}>
            <Input
              name="duration"
              value={courseData.duration}
              onChange={handleInputChange}
              placeholder={t("Enter duration")}
              type="number"
              style={styles.durationInput}
            />
            <Select
              value={durationType}
              onChange={handleDurationTypeChange}
              style={styles.select}
            >
              <Option value="hour">{t("hour")}</Option>
              <Option value="day">{t("day")}</Option>
              <Option value="month">{t("month")}</Option>
              <Option value="year">{t("year")}</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item style={styles.formItem}>
          <Button type="primary" onClick={handleSave} style={styles.saveButton}>
            Save
          </Button>
          <Button onClick={handleCancel} style={styles.cancelButton}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const styles: any = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    // backgroundColor: "#f7f9fc",
  },
  title: {
    textAlign: "center",
    color: "#1890ff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formItem: {
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #d9d9d9",
  },
  durationContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  durationInput: {
    width: "70%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #d9d9d9",
  },
  select: {
    width: "30%",
  },
  saveButton: {
    backgroundColor: "primary",
    // borderColor: "#52c41a",
    marginRight: "8px",
    width: "100px",
  },
  cancelButton: {
    width: "100px",
  },
};

export default AddCourse;
