import { GET_RESULT, UPDATE_GRADE } from "../../constant/actionType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/api";

export const getGrade = createAsyncThunk(
  GET_RESULT,
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getGrade();
      // console.log("response: ", response);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateGrade = createAsyncThunk(
  UPDATE_GRADE,
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      //console.log("data: ", data);
      const response = await api.updateGrade(id, data);
      // console.log("response.data: ", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
