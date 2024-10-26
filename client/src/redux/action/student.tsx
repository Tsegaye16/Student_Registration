import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GET_ALL_STUDENT,
  ADD_STUDENT,
  DELETE_STUDENT,
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
