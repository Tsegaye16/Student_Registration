import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Checkbox, Typography, Button, message, Space } from "antd";
import { getAllStudent, markAttendance } from "../../../redux/action/student";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface Student {
  _id: string;
  name: string;
  attendance: { date: string; status: "present" | "absent" }[];
  // startDate:any
}

interface propType {
  onDetailClick: any;
}

const Attendance: React.FC<propType> = ({ onDetailClick }) => {
  const dispatch = useDispatch();
  const students = useSelector(
    (state: any) => state.student?.studentData
  ) as Student[];

  //console.log("Filtered: ", filtered);
  const { t } = useTranslation();

  //console.log("Students: ", students);

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

        initialAttendance[student._id] = studentAttendance;
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
    console.log("finalDataToSend : ", finalDataToSend);
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
      title: t("Student Name"),
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
        title: `${t(day)}`,
        key: day,
        render: (_: any, record: Student) => {
          const isChecked = attendanceData[record._id]?.[day] ?? false;
          //console.log("Record", attendanceData[record.id]);
          return (
            <Checkbox
              checked={isChecked}
              onChange={() => handleCheckboxChange(record._id, day)}
              disabled={!isToday} // Disable if the day is not today
            />
          );
        },
      };
    }),
    {
      title: t("Action"),
      key: "actions",
      render: (text: string, record: Student) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={(event) => {
              event.stopPropagation();
              onDetailClick(text);
            }}
          >
            {" "}
            {t("Detail")}
          </Button>
        </Space>
      ),
    },
  ];

  // Map students to table rows

  return (
    <div style={{ padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={students}
        pagination={false}
        bordered
        title={() => t("Weekly Attendance")}
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
