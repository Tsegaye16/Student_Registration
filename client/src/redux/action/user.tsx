import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CHANGE_PASSWORD,
  GET_USER_BY_ID,
  UPDATE_PROFILE,
} from "../../constant/actionType";
import * as api from "../api/api";

// Thunk action to get user by ID
export const getUserById = createAsyncThunk(
  GET_USER_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.getUserById(id);

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk action to update user profile
export const updateProfile = createAsyncThunk(
  UPDATE_PROFILE,
  async ({ id, data }: { id: any; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateProfile(id, data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk action to change user password
export const changePassword = createAsyncThunk(
  CHANGE_PASSWORD,
  async (password: any, { rejectWithValue }) => {
    try {
      const response = await api.changePassword(password);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
