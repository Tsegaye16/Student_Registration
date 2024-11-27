import Student from "../models/studentModel.js"; // Mongoose Student model
import mongoose from "mongoose";

// Get All Students
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students
    res.status(200).json({ message: "successful", result: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student by ID
export const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(id); // Find student by ID
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "successful", result: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Student
export const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body); // Create a new student document

    await student.save(); // Save to the database
    res
      .status(200)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Students by IDs
export const deleteStudent = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate IDs
    if (
      !Array.isArray(ids) ||
      !ids.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      return res.status(400).json({ message: "Invalid student IDs" });
    }

    // Delete students with matching IDs
    const result = await Student.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "success", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate input fields
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    console.log("attendanceData: ", attendanceData);
    const updatePromises = attendanceData.map(async (attendance) => {
      const student = await Student.findById(attendance.studentId);

      if (!student) {
        throw new Error(`Student with ID ${attendance.studentId} not found`);
      }

      const existingAttendance = student.attendance || [];
      const existingRecordIndex = existingAttendance.findIndex(
        (record) => record.date === attendance.date
      );

      if (existingRecordIndex !== -1) {
        // Update existing record
        existingAttendance[existingRecordIndex].status = attendance.status;
      } else {
        // Add new record
        existingAttendance.push({
          date: attendance.date,
          status: attendance.status,
        });
      }

      student.attendance = existingAttendance;
      return student.save();
    });

    const updatedStudents = await Promise.all(updatePromises);

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

// Get Grades
export const getGrade = async (req, res) => {
  try {
    const students = await Student.find({}, "id name examScores"); // Fetch specific fields
    res.status(200).json({ message: "successful", result: students });
  } catch (error) {
    console.error("Error getting grade:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

// Update Grade
export const updateGrade = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Id: ", id);
    const { exitExam, writenExam, practiceExam } = req.body;

    // Validate the input to ensure scores are valid numbers
    if (
      typeof exitExam !== "number" ||
      typeof writenExam !== "number" ||
      typeof practiceExam !== "number"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Exam scores must be valid numbers",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { examScores: { exitExam, writenExam, practiceExam } },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    //console.log("updatedStudent:", updatedStudent);

    res.status(200).json({
      status: "success",
      message: "Grade updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
