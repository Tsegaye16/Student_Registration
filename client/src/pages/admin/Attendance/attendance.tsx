import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Checkbox, Typography, Button, message } from "antd";
import { getAllStudent, markAttendance } from "../../../redux/action/student";
import moment from "moment";

const { Text } = Typography;

interface Student {
  id: string;
  name: string;
  attendance: { date: string; status: "present" | "absent" }[];
}

const Attendance: React.FC = () => {
  const dispatch = useDispatch();
  const students = useSelector(
    (state: any) => state.student?.studentData?.result
  ) as Student[];

  console.log("Students: ", students);

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [attendanceData, setAttendanceData] = useState<{
    [studentId: string]: { [day: string]: boolean };
  }>({});
  const [isDirty, setIsDirty] = useState(false); // Track if there are unsaved changes
  const [initialData, setInitialData] = useState({}); // To reset on cancel

  // Fetch students on mount
  useEffect(() => {
    dispatch(getAllStudent() as any);
  }, [dispatch]);

  // Initialize attendanceData when students data is fetched
  useEffect(() => {
    if (students && students.length > 0) {
      const initialAttendance: {
        [studentId: string]: { [day: string]: boolean };
      } = {};

      students.forEach((student) => {
        const studentAttendance: { [day: string]: boolean } = {};

        weekdays.forEach((day, index) => {
          const date = moment()
            .startOf("week")
            .add(index + 1, "days")
            .format("YYYY-MM-DD");
          const attendanceRecord = student.attendance.find(
            (entry) => entry.date === date
          );
          studentAttendance[day] =
            attendanceRecord?.status === "present" || false;
        });

        initialAttendance[student.id] = studentAttendance;
      });
      setAttendanceData(initialAttendance);
      setInitialData(initialAttendance); // Store the initial state for reset
    }
  }, [students]);

  // Toggle attendance for a specific student and day
  const handleCheckboxChange = (studentId: string, day: string) => {
    setAttendanceData((prevData) => {
      const updatedData = {
        ...prevData,
        [studentId]: {
          ...prevData[studentId],
          [day]: !prevData[studentId][day],
        },
      };
      setIsDirty(true); // Mark changes as dirty
      return updatedData;
    });
  };

  // Check if there is at least one present student
  const hasPresentStudent = Object.values(attendanceData).some((studentDays) =>
    Object.values(studentDays).some((status) => status)
  );

  // Save only today's attendance data to the backend
  const handleSave = async () => {
    const today = moment().format("YYYY-MM-DD");
    const todayIndex = weekdays.findIndex((day) =>
      moment()
        .startOf("week")
        .add(weekdays.indexOf(day) + 1, "days")
        .isSame(moment(), "day")
    );

    // Prepare data to send only for checked students
    const formattedData = Object.entries(attendanceData)
      .filter(([studentId, days]) => days[weekdays[todayIndex]]) // Keep only checked students
      .map(([studentId]) => ({
        studentId,
        date: today,
        status: "present", // Only send present status for checked students
      }));
    console.log("Present Data: ", formattedData);
    // Add absent students for today's date if they are not checked
    const absentStudentsData = Object.entries(attendanceData)
      .filter(([studentId, days]) => !days[weekdays[todayIndex]]) // Keep only unchecked students
      .map(([studentId]) => ({
        studentId,
        date: today,
        status: "absent", // Only send absent status for unchecked students
      }));

    // Combine present and absent student data
    const finalDataToSend = [...formattedData, ...absentStudentsData];
    const response = await dispatch(markAttendance(finalDataToSend) as any);
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      setIsDirty(false);
    } else if (response?.error) {
      if (response.payload.includes(":")) {
        message.error(`${response.payload.split(":")[1]?.trim()}`);
      } else {
        message.error(response.payload); // or handle it another way if `:` is not present
      }
    }
  };

  // Cancel changes and reset attendance to initial state
  const handleCancel = () => {
    setAttendanceData(initialData);
    setIsDirty(false);
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    ...weekdays.map((day, index) => {
      const currentDate = moment()
        .startOf("week")
        .add(index + 1, "days");
      const isToday = currentDate.isSame(moment(), "day");

      return {
        title: day,
        key: day,
        render: (_: any, record: Student) => {
          const isChecked = attendanceData[record.id]?.[day] ?? false;

          return (
            <Checkbox
              checked={isChecked}
              onChange={() => handleCheckboxChange(record.id, day)}
              disabled={!isToday} // Disable if the day is not today
            />
          );
        },
      };
    }),
  ];

  // Map students to table rows
  const data: any = students?.map((student) => ({
    key: student.id,
    id: student.id,
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

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Button type="primary" onClick={handleSave} disabled={!isDirty}>
          Save
        </Button>
        <Button onClick={handleCancel} disabled={!isDirty}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Attendance;
