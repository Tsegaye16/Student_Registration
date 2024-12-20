import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Progress,
  Divider,
  Tooltip,
  message,
} from "antd";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "./style.css";
import { getAllCourse } from "../../../redux/action/course";
import { updateStudent } from "../../../redux/action/student";
import { styles } from "./style";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Title } = Typography;

interface propType {
  studentInfo: any;
  onback: any;
}

const StudentDetail: React.FC<propType> = ({ studentInfo, onback }) => {
  const [student, setStudent] = useState({
    name: "",
    phoneNumber: "",
    course: "",
    shift: "",
    startDate: null as moment.Moment | null,
    paymentStatus: "",
    amountPaid: 0,
  });

  const [isDataChanged, setIsDataChanged] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Update progress percentage when start date or selected course changes
  const courses = useSelector((state: any) => state.course?.courseData);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllCourse() as any);
  }, [dispatch]);

  useEffect(() => {
    calculateProgress();
  }, [student.startDate, student.course]);
  //console.log("Progress", progressPercent);

  const calculateProgress = () => {
    const selectedCourse = courses?.find(
      (course: any) => course.name === student.course
    );

    if (student.startDate && selectedCourse?.duration) {
      const courseDurationDays = convertDurationToDays(selectedCourse.duration);
      const daysPassed = moment().diff(student.startDate, "days");
      console.log("daysPassed: ", daysPassed);

      // Calculate the percentage of the course completed
      const progress = Math.round(
        Math.min((daysPassed / courseDurationDays) * 100, 100)
      );
      setProgressPercent(progress);
    } else {
      setProgressPercent(0);
    }
  };

  const convertDurationToDays = (duration: string) => {
    const [value, unit] = duration.split(" ");
    const numericValue = parseInt(value, 10);
    console.log("unit: ", unit);
    switch (unit.toLowerCase()) {
      case "Hour":
        return numericValue / 24; // Convert hours to days
      case "Day":
        return numericValue; // Already in days
      case "month":
        return numericValue * 30; // Approximate months to days
      case "Year":
        return numericValue * 365; // Approximate years to days
      default:
        return 0; // Handle unknown unit
    }
  };

  useEffect(() => {
    if (studentInfo) {
      setStudent({
        name: studentInfo.name,
        phoneNumber: studentInfo.phoneNumber,
        course: studentInfo.course,
        shift: studentInfo.shift,
        startDate: studentInfo.startDate ? moment(studentInfo.startDate) : null,
        paymentStatus: studentInfo.paymentStatus,
        amountPaid: studentInfo.amountPaid,
      });
    }
  }, [studentInfo]);

  const handleProfileUpdate = (values: any) => {
    setStudent({ ...student, ...values });
  };

  const handleinputChange = (e: any) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
    setIsDataChanged(true);
  };

  const handleCourseAssign = (course: any) => {
    setStudent({ ...student, course });
    setIsDataChanged(true);
  };
  const handleShift = (shift: any) => {
    setStudent({ ...student, shift });
    setIsDataChanged(true);
  };
  const handlePaymentStatus = (paymentStatus: string) => {
    setStudent({ ...student, paymentStatus });
    setIsDataChanged(true);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setStudent({ ...student, startDate: date });
    setIsDataChanged(true);
  };

  const handleOk = (date: moment.Moment | null) => {
    if (date) {
      setStudent({ ...student, startDate: date });
    }
  };

  const handleSave = async () => {
    console.log("All changes saved", student);
    const response = await dispatch(
      updateStudent({ id: studentInfo.id, data: student }) as any
    );
    console.log("response::: ", response);
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      // onSave();
    } else if (response?.error) {
      if (response.payload.includes(":")) {
        message.error(`${response.payload.split(":")[1]?.trim()}`);
      } else {
        message.error(response.payload); // or handle it another way if `:` is not present
      }
    }
  };

  const [currentStep, setCurrentStep] = useState(0); // Track the current step in the form sections
  const [direction, setDirection] = useState("next");

  const forms = [
    <Form
      layout="vertical"
      onFinish={handleProfileUpdate}
      initialValues={student}
    >
      <Divider>
        <Title level={4} style={styles.title}>
          {t("Student Profile")}
        </Title>
      </Divider>

      <div style={styles.twoColumn}>
        <Form.Item label={t("Name")} style={styles.formItem}>
          <Input
            style={{ width: "70%" }}
            name="name"
            placeholder={t("Student Name")}
            value={student.name}
            onChange={handleinputChange}
          />
        </Form.Item>
        <Form.Item label={t("Assign Course")} style={styles.formItem}>
          <Select
            style={{ width: "70%" }}
            value={student?.course}
            onChange={handleCourseAssign}
            placeholder="Select course"
          >
            {courses?.map((course: any) => (
              <Option key={course.id} value={course.name}>
                {course.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("Assign Shift")} style={styles.formItem}>
          <Select
            placeholder="Select shift"
            onChange={handleShift}
            value={student.shift}
            style={{ width: "70%" }}
          >
            <Option value="afternoon">{t("Morning")}</Option>
            <Option value="evening">{t("Evining")}</Option>
          </Select>
        </Form.Item>
        <Form.Item label={t("Phone Number")} style={styles.formItem}>
          <Input
            style={{ width: "70%" }}
            name="phoneNumber"
            placeholder={t("Student Phone number")}
            value={student.phoneNumber}
            onChange={handleinputChange}
          />
        </Form.Item>
        <Form.Item label={t("Class Start Date")} style={styles.formItem}>
          <DatePicker
            style={{ width: "70%" }}
            onChange={handleDateChange}
            onOk={handleOk}
            placeholder={t("Select class start date")}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
            value={student.startDate}
          />
        </Form.Item>
      </div>
    </Form>,
    <Form layout="vertical">
      <Divider>
        <Title level={4} style={styles.title}>
          {t("Payment Information")}
        </Title>
      </Divider>
      <div style={styles.twoColumn}>
        {/* Payment Information Form */}

        <Form.Item label={t("Payment Status")} style={styles.formItem}>
          <Select
            style={{ width: "70%" }}
            value={student?.paymentStatus}
            onChange={handlePaymentStatus}
            placeholder={t("Select payment status")}
          >
            <Option value="paid">{t("Paid")}</Option>
            <Option value="unpaid">{t("Unpaid")}</Option>
            <Option value="partially">{t("Partially")}</Option>
          </Select>
        </Form.Item>
        <Form.Item label={t("Amount Paid")} style={styles.formItem}>
          <Input
            style={{ width: "70%" }}
            name="amountPaid"
            placeholder={t("Enter amount")}
            value={student?.amountPaid}
            onChange={handleinputChange}
          />
        </Form.Item>
      </div>
    </Form>,
  ];

  const handleNext = () => {
    setDirection("next");
    if (currentStep < forms.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setDirection("prev");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>
        <Tooltip title="Back">
          <Button type="link" onClick={onback}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              style={styles.icon}
            >
              <path d="M22 3.59375L20.40625 4.8125L1.40625 19.1875L0.34375 20L1.40625 20.8125L20.40625 35.1875L22 36.40625L22 26.09375C34.339844 26.347656 40.796875 30.738281 44.1875 35.125C47.679688 39.644531 48 44.0625 48 44.0625L50 44.03125C50 44.03125 50 43.9375 50 43.9375C50 43.9375 50 43.90625 50 43.90625C50.007813 43.710938 50.226563 36.460938 46.78125 29.0625C43.375 21.742188 36.136719 14.414063 22 14.0625 Z M 20 7.625L20 16L21 16C35.167969 16 41.710938 22.9375 44.96875 29.9375C45.914063 31.96875 46.519531 33.917969 46.96875 35.78125C46.582031 35.144531 46.28125 34.519531 45.78125 33.875C41.929688 28.894531 34.550781 24 21 24L20 24L20 32.375L3.65625 20Z"></path>
            </svg>
          </Button>
        </Tooltip>
      </div>
      <Card
        title={t("Student Details")}
        bordered={false}
        style={{ width: "100%" }}
      >
        <TransitionGroup component={null}>
          <CSSTransition
            key={currentStep}
            timeout={300}
            classNames={direction === "next" ? "slide-left" : "slide-right"}
            unmountOnExit
          >
            <div>{forms[currentStep]}</div>
          </CSSTransition>
        </TransitionGroup>

        <Form.Item style={styles.formItem}>
          <Button
            htmlType="submit"
            style={styles.saveButton}
            disabled={!isDataChanged}
            onClick={handleSave}
          >
            {t("Save Changes")}
          </Button>
        </Form.Item>
        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Button onClick={handlePrev} disabled={currentStep === 0}>
            {t("Previous")}
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === forms.length - 1}
          >
            {t("Next")}
          </Button>
        </div>
        <Divider />
        <Card
          title={t("Student Progress")}
          // type="inner"
          style={{ marginBottom: "20px" }}
        >
          {progressPercent === 0 &&
          student.startDate &&
          moment.isMoment(student.startDate) &&
          student.startDate.isAfter(moment()) ? (
            <Title level={5}>The course has not started yet</Title>
          ) : (
            <Progress percent={progressPercent} />
          )}
        </Card>
      </Card>
    </div>
  );
};

export default StudentDetail;
