import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Select, Form, Typography, message } from "antd";
import { addStudent } from "../../../redux/action/student";
const { Option } = Select;
const { Title } = Typography;

interface propType {
  onSave: any;
}
const AddStudent: React.FC<propType> = ({ onSave }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    phoneNumber: "",
  });

  const dispatch = useDispatch();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSave = async () => {
    const response = await dispatch(addStudent(studentData) as any);
    console.log("response error: ", response);
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      onSave();
    } else if (response?.error) {
      message.error(`${response.payload.split(":")[1]?.trim()}`);
    }
  };

  const handleCancel = () => {
    setStudentData({
      name: "",
      phoneNumber: "",
    });

    onSave();
  };
  return (
    <div style={styles.container}>
      <Title level={3} style={styles.title}>
        Registering student
      </Title>
      <Form layout="vertical" style={styles.form}>
        <Form.Item label="Course Name" style={styles.formItem}>
          <Input
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            placeholder="Enter student name"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item label="Phone number" style={styles.formItem}>
          <Input
            name="phoneNumber"
            value={studentData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter student phone number"
            // type="number"
            style={styles.input}
          />
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
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f7f9fc",
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

export default AddStudent;
