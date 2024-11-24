import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Badge, Card, Typography, Row, Col, Button } from "antd";
import { getStudentById } from "../../../redux/action/student";
import dayjs, { Dayjs } from "dayjs";
import { getAllCourse } from "../../../redux/action/course";

const { Text, Title } = Typography;

interface PropType {
  record: { id: string };
}

const AttendanceDetail: React.FC<PropType> = ({ record }) => {
  const dispatch = useDispatch();
  const student = useSelector((state: any) => state.student?.selectedStudent);
  const courses = useSelector((state: any) => state.course?.courseData);
  console.log("recored: ", record);
  const courseDuration = student?.course
    ? courses.find((course: any) => course?.name === student.course)?.duration
    : null;
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  useEffect(() => {
    dispatch(getStudentById(record.id) as any);
    dispatch(getAllCourse() as any);
  }, [dispatch, record.id]);

  const startDate = student?.startDate
    ? dayjs(student.startDate, "YYYY-MM-DD")
    : dayjs();
  const attendanceData = student?.attendance || [];

  const parseCourseDuration = (duration: string) => {
    if (!duration) return 0;
    const [amount, unit] = duration.split(" ");
    const quantity = parseInt(amount, 10);
    switch (unit) {
      case "week":
      case "weeks":
        return Math.ceil(quantity / 4);
      case "month":
      case "months":
        return quantity;
      case "year":
      case "years":
        return quantity * 12;
      default:
        return 0;
    }
  };

  const courseMonths = parseCourseDuration(courseDuration);
  const endDate = startDate?.add(courseMonths, "month");

  const isWeekend = (date: Dayjs) => date.day() === 6 || date.day() === 0;

  const getAttendanceStatus = (date: Dayjs) => {
    if (date.isBefore(startDate, "day")) {
      return null; // Do not mark or render anything before startDate
    }

    const attendanceRecord = attendanceData.find((entry: any) =>
      dayjs(entry.date).isSame(date, "day")
    );

    if (attendanceRecord) {
      return attendanceRecord.status === "present" ? "success" : "error";
    }

    if (!isWeekend(date) && date.isBefore(dayjs(), "day")) {
      return "error"; // Mark as absent for past weekdays without attendance
    }

    if (isWeekend(date)) {
      return "warning"; // Weekend
    }

    return null; // Future days or holidays
  };

  const dateCellRender = (date: Dayjs) => {
    const status = getAttendanceStatus(date);
    return status ? <Badge status={status} /> : null;
  };

  const handlePreviousMonth = () => {
    if (currentMonth.isAfter(startDate, "month")) {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    }
  };

  const handleNextMonth = () => {
    if (currentMonth.isBefore(endDate, "month")) {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
  };

  if (!student?.startDate) {
    return (
      <div style={{ padding: "24px" }}>
        <Title level={4}>{student?.name}'s Attendance</Title>
        <Text type="warning">The student has not started yet.</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={4}>{student?.name}'s Attendance</Title>
      <Text>Starting from: {startDate.format("MMMM YYYY")}</Text>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Button
          onClick={handlePreviousMonth}
          disabled={!currentMonth.isAfter(startDate, "month")}
        >
          Previous Month
        </Button>
        <Text strong>{currentMonth.format("MMMM YYYY")}</Text>
        <Button
          onClick={handleNextMonth}
          disabled={!currentMonth.isBefore(endDate, "month")}
        >
          Next Month
        </Button>
      </div>

      <Calendar
        dateCellRender={dateCellRender}
        validRange={[startDate, endDate]}
        value={currentMonth}
        style={{
          marginTop: "16px",
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
        }}
      />

      <Card style={{ marginTop: "16px" }}>
        <Title level={5}>Legend</Title>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Badge color="green" text="Present" />
          </Col>
          <Col span={6}>
            <Badge color="red" text="Absent" />
          </Col>
          <Col span={6}>
            <Badge color="blue" text="Holiday" />
          </Col>
          <Col span={6}>
            <Badge color="orange" text="Weekend" />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AttendanceDetail;
