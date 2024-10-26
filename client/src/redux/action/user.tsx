import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

// Slice for handling user state
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Additional synchronous reducers can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userData = { ...(state.userData || {}), ...action.payload };
      })
      .addCase(changePassword.fulfilled, (state, action) => {})
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.error = action.payload;
        }
      );
  },
});

// Export actions
export const {} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
