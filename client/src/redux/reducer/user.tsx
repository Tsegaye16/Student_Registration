import { createSlice } from "@reduxjs/toolkit";

import { changePassword, getUserById, updateProfile } from "../action/user";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getUserById.rejected, (state: any, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.userData = action.payload;
      });
  },
});

// Export reducer
export default userSlice.reducer;
