import { combineReducers } from "redux";

import authReducer from "./auth";
import userReducer from "./user";
import courseReducer from "./course";

import { LOGOUT } from "../../constant/actionType";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  course: courseReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    // Reset all state to initial values
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
