import { combineReducers } from "redux";

import authReducer from "./auth";
import userReducer from "./user";

import { LOGOUT } from "../../constant/actionType";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    // Reset all state to initial values
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
