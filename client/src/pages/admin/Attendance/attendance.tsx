import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Checkbox, Typography } from "antd";
import { getAllStudent } from "../../../redux/action/student";
import moment from "moment";

const { Text } = Typography;

interface Student {
  id: string;
  name: string;
}

interface AttendanceData {
  [studentId: string]: {
    [day: string]: boolean;
  };
}

const Attendance: React.FC = () => {
  const dispatch = useDispatch();
  const students = useSelector(
    (state: any) => state.student?.studentData?.result
  ) as Student[];

  const [weekdays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [today] = useState(moment());
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

  useEffect(() => {
    dispatch(getAllStudent() as any);
  }, [dispatch]);

  useEffect(() => {
    if (students && students.length > 0) {
      const initialAttendance: AttendanceData = {};
      students.forEach((student) => {
        initialAttendance[student.id] = {};
        weekdays.forEach((day) => {
          initialAttendance[student.id][day] = false;
        });
      });
      setAttendanceData(initialAttendance);
    }
  }, [students, weekdays]);

  const isWeekend = today.day() === 6 || today.day() === 0;
  const todayIndex = today.isoWeekday() - 1;

  const handleCheckboxChange = (studentId: string, day: string) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [studentId]: {
        ...prevData[studentId],
        [day]: !prevData[studentId]?.[day],
      },
    }));
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    ...weekdays.map((day, index) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (_: any, record: Student) => {
        const isToday = todayIndex === index;
        const isChecked = attendanceData[record.id]?.[day] || false;
        const isDisabled = !isToday || isWeekend;

        return (
          <Checkbox
            checked={isChecked}
            disabled={isDisabled}
            onChange={() => handleCheckboxChange(record.id, day)}
          />
        );
      },
    })),
  ];

  const data: any = students?.map((student: Student) => ({
    key: student.id,
    name: student.name,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        title={() => "Weekly Attendance"}
      />
    </div>
  );
};

export default Attendance;
