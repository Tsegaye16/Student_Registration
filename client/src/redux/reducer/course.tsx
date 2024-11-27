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
          (course: any) => !deletedIds.includes(course._id)
        );
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const updatedCourse = action.payload.course;
        console.log("action.payload: ", action.payload);
        state.courseData = state.courseData.map((course: any) =>
          course._id === updatedCourse.id ? updateCourse : course
        );
      });
  },
});

export default courseSlice.reducer;
