import { combineReducers } from "redux";
import authReducer from "./auth";
import userReducer from "./user";
import courseReducer from "./course";
import studentReducer from "./student";
import { logOut } from "./auth"; // Import logOut action for resetting state

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  course: courseReducer,
  student: studentReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === logOut.type) {
    state = undefined; // Reset all state to initial values
  }
  return appReducer(state, action);
};

export default rootReducer;
