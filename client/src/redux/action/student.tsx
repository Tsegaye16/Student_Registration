import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GET_ALL_STUDENT,
  ADD_STUDENT,
  DELETE_STUDENT,
  UPDATE_STUDENT_BY_ID,
  MARK_ATTENDANCE,
  GET_STUDENT_BY_ID,
} from "../../constant/actionType";
import * as api from "../api/api";

export const getAllStudent = createAsyncThunk(
  GET_ALL_STUDENT,
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllStudent();

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getStudentById = createAsyncThunk(
  GET_STUDENT_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.getStudentById(id);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addStudent = createAsyncThunk(
  ADD_STUDENT,
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.addStudent(data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  DELETE_STUDENT,
  async (id: string[], { rejectWithValue }) => {
    try {
      const response = await api.deleteStudent(id);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateStudent = createAsyncThunk(
  UPDATE_STUDENT_BY_ID,
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateStudent(id, data);

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAttendance = createAsyncThunk(
  MARK_ATTENDANCE,
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.markAttendance(data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
