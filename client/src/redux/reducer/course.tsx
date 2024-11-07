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
    courseData: [] as any[],
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
        //console.log("Course", action.payload);
        state.courseData = action.payload.result;
      })
      .addCase(getAllCourse.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courseData = action.payload.result; // Handle added course
      })
      .addCase(deleteCourse.fulfilled, (state: any, action) => {
        const deletedIds = action.meta.arg;

        // Return a new array reference for reactivity
        state.courseData = state.courseData.filter(
          (course: any) => !deletedIds.includes(course.id)
        );
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.courseData = action.payload;
      });
  },
});

export default courseSlice.reducer;
