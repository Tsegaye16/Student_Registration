import { Op } from "sequelize";
import Student from "../models/studentModel.js";
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({ message: "successfull", result: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findOne({ where: { id: id } });
    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }
    res.status(200).json({ message: "successfull", result: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addStudent = async (req, res) => {
  try {
    console.log(req.body);
    const student = new Student(req.body);

    await student.save();
    res
      .status(200)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { ids } = req.body;
    // delete all course based on list of id
    const result = await Student.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    res.status(200).json({ message: "success", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Id: ", id);
    const { name, phoneNumber, course, startDate, shift } = req.body;
    const student = await Student.update(
      { name, phoneNumber, course, startDate, shift },
      {
        where: { id: id },
      }
    );
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  const attendanceData = req.body;

  try {
    const updatePromises = attendanceData.map(async (attendance) => {
      const student = await Student.findByPk(attendance.studentId);

      if (!student) {
        throw new Error(`Student with ID ${attendance.studentId} not found`);
      }

      // Check for existing attendance records
      const existingAttendance = student.attendance || [];

      // Find if the attendance for the given date already exists
      const existingRecordIndex = existingAttendance.findIndex(
        (record) => record.date === attendance.date
      );

      let updatedAttendance;
      if (existingRecordIndex !== -1) {
        // If a record exists for the date, update the status
        updatedAttendance = existingAttendance.map((record, index) =>
          index === existingRecordIndex
            ? { ...record, status: attendance.status }
            : record
        );
      } else {
        // If no record exists for the date, add a new record
        updatedAttendance = [
          ...existingAttendance,
          { date: attendance.date, status: attendance.status },
        ];
      }

      // Update the student record with the updated attendance
      return student.update({ attendance: updatedAttendance });
    });

    const updatedStudents = await Promise.all(updatePromises);

    // Send back updated students
    res.status(200).json({
      status: "success",
      message: "Attendance updated successfully",
      data: updatedStudents,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
