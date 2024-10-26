import { Input, Button, Select, Form, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { updateCourse } from "../../../redux/action/course";

const { Option } = Select;
const { Title } = Typography;

interface Props {
  courseInfo: { id: string; name: string; duration: string; price: string };
  onSave: any;
}

const EditCourse: React.FC<Props> = ({ courseInfo, onSave }) => {
  const [courseData, setCourseData] = useState({
    name: "",
    duration: "",
    price: "",
  });
  const [durationType, setDurationType] = useState("hour");
  const [isDataChanged, setIsDataChanged] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const { name, price } = courseInfo;

    // Extract duration number and type from the courseInfo.duration string (e.g., "4 month")
    const [durationValue, durationUnit] = courseInfo.duration.split(" ");

    setCourseData({
      name: name || "",
      duration: durationValue || "",
      price: price || "",
    });

    // Set duration type to match the extracted unit
    setDurationType(durationUnit || "hour");
  }, [courseInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({ ...prevData, [name]: value }));
    setIsDataChanged(true);
  };

  const handleDurationTypeChange = (value: string) => {
    setDurationType(value);
    setIsDataChanged(true);
  };

  const handleSave = async () => {
    const updatedData = {
      ...courseData,
      duration: `${courseData.duration} ${durationType}`,
    };

    const response = await dispatch(
      updateCourse({ id: courseInfo.id, data: updatedData }) as any
    );

    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      onSave();
    } else if (response?.error) {
      message.error(`${response.payload.split(":")[1]?.trim()}`);
    }
  };

  const handleCancel = () => {
    // setCourseData({ name: "", duration: "", price: "" });
    //setDurationType("hour");
    onSave();
  };

  return (
    <div style={styles.container}>
      <Title level={4} style={styles.title}>
        Editing Course
      </Title>
      <Form layout="vertical" style={styles.form}>
        <Form.Item label="Course Name" style={styles.formItem}>
          <Input
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            placeholder="Enter course name"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item label="Price" style={styles.formItem}>
          <Input
            name="price"
            value={courseData.price}
            onChange={handleInputChange}
            placeholder="Enter course price"
            type="number"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item label="Duration" style={styles.formItem}>
          <div style={styles.durationContainer}>
            <Input
              name="duration"
              value={courseData.duration}
              onChange={handleInputChange}
              placeholder="Enter duration"
              type="number"
              style={styles.durationInput}
            />
            <Select
              value={durationType}
              onChange={handleDurationTypeChange}
              style={styles.select}
            >
              <Option value="hour">Hour</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item style={styles.formItem}>
          <Button
            type="primary"
            onClick={handleSave}
            disabled={!isDataChanged}
            //style={{ marginRight: 8 }}
            style={styles.saveButton}
          >
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
    //borderColor: "#52c41a",
    marginRight: "8px",
    width: "100px",
  },
  cancelButton: {
    width: "100px",
  },
};

export default EditCourse;
