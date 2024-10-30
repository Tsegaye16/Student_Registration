import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Select, Form, Typography, message } from "antd";
import { addStudent } from "../../../redux/action/student";
import { getAllCourse } from "../../../redux/action/course";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Title } = Typography;

interface propType {
  onSave: any;
}

const AddStudent: React.FC<propType> = ({ onSave }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    phoneNumber: "",
    course: "",
    shift: "", // New field for shift
  });

  const courses = useSelector((state: any) => state.course?.courseData?.result);
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    dispatch(getAllCourse() as any);
  }, [dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleCourseChange = (value: string) => {
    setStudentData({ ...studentData, course: value });
  };

  const handleShiftChange = (value: string) => {
    setStudentData({ ...studentData, shift: value });
  };

  const handleSave = async () => {
    const response = await dispatch(addStudent(studentData) as any);
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
    setStudentData({
      name: "",
      phoneNumber: "",
      course: "",
      shift: "", // Reset shift field
    });
    onSave();
  };

  return (
    <div style={styles.container}>
      <Title level={3} style={styles.title}>
        {t("Registering Student")}
      </Title>
      <Form layout="vertical" style={styles.form}>
        <Form.Item label={t("Student Name")} style={styles.formItem}>
          <Input
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            placeholder={t("Enter student name")}
            style={styles.input}
          />
        </Form.Item>

        <Form.Item label={t("Phone Number")} style={styles.formItem}>
          <Input
            name="phoneNumber"
            value={studentData.phoneNumber}
            onChange={handleInputChange}
            placeholder={t("Enter student phone number")}
            style={styles.input}
          />
        </Form.Item>

        {/* Course and Shift Selection */}
        <div style={styles.horizontalContainer}>
          <Form.Item label={t("Select course")} style={styles.formItem}>
            <Select
              placeholder="Select course"
              onChange={handleCourseChange}
              value={studentData.course}
              style={styles.select}
            >
              {courses?.map((course: any) => (
                <Option key={course.id} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t("Select shift")} style={styles.formItem}>
            <Select
              placeholder={t("Select shift")}
              onChange={handleShiftChange}
              value={studentData.shift}
              style={styles.select}
            >
              <Option value="afternoon">{t("Morning")}</Option>
              <Option value="evening">{t("Evining")}</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item style={styles.formItem}>
          <Button type="primary" onClick={handleSave} style={styles.saveButton}>
            {t("Save")}
          </Button>
          <Button onClick={handleCancel} style={styles.cancelButton}>
            {t("cancel")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const styles: any = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    //boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    //backgroundColor: "#f7f9fc",
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
    marginBottom: "8px",
    flex: 1,
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #d9d9d9",
  },
  horizontalContainer: {
    display: "flex",
    justifyContent: "space-between", // Add space between items
    gap: "16px",
  },
  select: {
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#1890ff",
    marginRight: "8px",
    width: "100px",
  },
  cancelButton: {
    width: "100px",
  },
};

export default AddStudent;
