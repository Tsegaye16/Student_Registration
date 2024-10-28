import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addStudent, deleteStudent, getAllStudent } from "../action/student";
import { updateCourse } from "../action/course";

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
        if (Array.isArray(state.studentData)) {
          state.studentData.push(action.payload); // Ensures it's an array before pushing
        } else {
          state.studentData = [action.payload]; // Reset as an array if something changed its type
        }
        state.loading = false;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add student";
      })
      .addCase(deleteStudent.fulfilled, (state: any, action: any) => {
        const deletedIds = action.meta.arg;
        if (state.studentData && Array.isArray(state.studentData.result)) {
          state.studentData = {
            ...state.studentData,
            result: state.studentData.result.filter(
              (student: any) => !deletedIds.includes(student.id)
            ),
          };
        }
      })
      .addCase(updateCourse.fulfilled, (state: any, action: any) => {
        const updatedStudent = action.payload;
        if (state.studentData && Array.isArray(state.studentData.result)) {
          state.studentData = {
            ...state.studentData,
            result: state.studentData.result.map((student: any) => {
              if (student.id === updatedStudent.id) {
                return updatedStudent;
              }
              return student;
            }),
          };
        }
      });
  },
});

export default studentSlice.reducer;
