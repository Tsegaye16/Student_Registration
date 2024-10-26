import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  EMAIL_CONFIRMATION,
  LOGOUT,
  SIGNIN,
  SIGNUP,
} from "../../constant/actionType";

interface AuthState {
  authData: any | null; // Replace `any` with your actual auth data type
}

const initialState: AuthState = {
  authData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<any>) => {
      //localStorage.setItem("user", action.payload.token);
      state.authData = action.payload;
    },
    logOut: (state) => {
      localStorage.removeItem("user");
      state.authData = null;
    },
    signUp: (state, action: PayloadAction<any>) => {
      state.authData = action.payload;
    },
    emailConfirmation: (state, action: PayloadAction<any>) => {
      state.authData = action.payload;
    },
  },
});

// Export actions
export const { signIn, logOut, signUp, emailConfirmation } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
