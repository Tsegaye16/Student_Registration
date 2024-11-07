import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addStudent,
  deleteStudent,
  getAllStudent,
  getStudentById,
  markAttendance,
  updateStudent,
} from "../action/student";

const studentSlice = createSlice({
  name: "student",
  initialState: {
    studentData: [] as any[], // Array for all students
    selectedStudent: null as any | null, // Object for a single student
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudent.fulfilled, (state, action: any) => {
        state.studentData = action.payload.result; // Set list of students
        state.loading = false;
      })
      .addCase(getAllStudent.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentById.fulfilled, (state, action: any) => {
        state.selectedStudent = action.payload.result; // Set single student
        state.loading = false;
      })
      .addCase(getStudentById.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action: PayloadAction<any>) => {
        state.studentData.push(action.payload.data); // Push new student to students array
        state.loading = false;
      })
      .addCase(addStudent.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStudent.fulfilled, (state, action: any) => {
        const deletedIds = action.meta.arg;
        state.studentData = state.studentData.filter(
          (student: any) => !deletedIds.includes(student.id)
        );
      })
      .addCase(updateStudent.fulfilled, (state, action: any) => {
        const updatedStudent = action.payload;
        state.studentData = state.studentData.map((student: any) =>
          student.id === updatedStudent.id ? updatedStudent : student
        );
      })
      .addCase(
        markAttendance.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          const attendanceData = Array.isArray(action.payload)
            ? action.payload
            : [];
          attendanceData.forEach((record) => {
            const studentIndex = state.studentData.findIndex(
              (student) => student.id === record.studentId
            );
            if (studentIndex !== -1) {
              const student = state.studentData[studentIndex];
              if (!student.attendance) {
                student.attendance = [];
              }
              const existingAttendance = student.attendance.find(
                (att: any) => att.date === record.date
              );
              if (existingAttendance) {
                existingAttendance.status = record.status;
              } else {
                student.attendance.push({
                  date: record.date,
                  status: record.status,
                });
              }
            }
          });
        }
      );
  },
});

export default studentSlice.reducer;
