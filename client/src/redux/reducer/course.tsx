import { createSlice } from "@reduxjs/toolkit";
import {
  addCourse,
  deleteCourse,
  getAllCourse,
  updateCourse,
} from "../action/course";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courseData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courseData = action.payload;
      })
      .addCase(getAllCourse.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courseData = action.payload; // Handle added course
      })
      .addCase(deleteCourse.fulfilled, (state: any, action) => {
        const deletedIds = action.meta.arg;

        if (state.courseData && Array.isArray(state.courseData.result)) {
          // Return a new array reference for reactivity
          state.courseData = {
            ...state.courseData,
            result: state.courseData.result.filter(
              (course: any) => !deletedIds.includes(course.id)
            ),
          };
        }
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.courseData = action.payload;
      });
  },
});

export default courseSlice.reducer;
