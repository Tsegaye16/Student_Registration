import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addStudent,
  deleteStudent,
  getAllStudent,
  markAttendance,
} from "../action/student";
import { updateStudent } from "../action/student";

interface StudentState {
  studentData: any[]; // Define as an array type to avoid null issues
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  studentData: [], // Start with an empty array to prevent null
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStudent.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.studentData = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAllStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch students";
      })
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action: PayloadAction<any>) => {
        state.studentData.push(action.payload); // Directly pushing the new student
        state.loading = false;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add student";
      })
      .addCase(deleteStudent.fulfilled, (state: any, action: any) => {
        const deletedIds = action.meta.arg;
        state.studentData = state.studentData.filter(
          (student: any) => !deletedIds.includes(student.id)
        );
      })
      .addCase(updateStudent.fulfilled, (state: any, action: any) => {
        const updatedStudent = action.payload;
        state.studentData = state.studentData.map((student: any) => {
          if (student.id === updatedStudent.id) {
            return updatedStudent;
          }
          return student;
        });
      })
      .addCase(
        markAttendance.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          const attendanceData = Array.isArray(action.payload)
            ? action.payload
            : []; // Ensure attendanceData is an array

          attendanceData.forEach((record) => {
            const studentIndex = state.studentData.findIndex(
              (student) => student.id === record.studentId
            );

            if (studentIndex !== -1) {
              const student = state.studentData[studentIndex];

              if (!student.attendance) {
                student.attendance = []; // Initialize attendance if not present
              }

              const existingAttendance = student.attendance.find(
                (att: any) => att.date === record.date
              );

              if (existingAttendance) {
                existingAttendance.status = record.status; // Update status if it exists
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
