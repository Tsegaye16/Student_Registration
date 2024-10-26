import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/api";
import {
  GET_ALL_COURSE,
  ADD_COURSE,
  DELETE_COURSE,
  UPDATE_COURSE_BY_ID,
} from "../../constant/actionType";

// Fetch all courses
export const getAllCourse = createAsyncThunk(
  GET_ALL_COURSE,
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCourses();

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Add a new course
export const addCourse = createAsyncThunk(
  ADD_COURSE,
  async (courseData: any, { rejectWithValue }) => {
    try {
      const response = await api.addCourse(courseData);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a course
export const deleteCourse = createAsyncThunk(
  DELETE_COURSE,
  async (id: string[], { rejectWithValue }) => {
    try {
      const response = await api.deleteCourse(id);

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCourse = createAsyncThunk(
  UPDATE_COURSE_BY_ID,
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateCourse(id, data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
