import {
  GET_USER_BY_ID,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} from "../../constant/actionType";

interface User {
  id: string;
  name: string;
  email: string;
}

interface StatData {
  totalSurveys: number;
  totalResponses: number;
}

interface UserState {
  user: User | null;
  statData?: StatData;
}

interface Action<T = any> {
  type: string;
  payload?: T;
}

const initialState: UserState = {
  user: null,
};

const userReducer = (
  state: UserState = initialState,
  action: Action
): UserState => {
  switch (action.type) {
    case GET_USER_BY_ID:
      return { ...state, user: action.payload as User };
    case UPDATE_PROFILE:
      return { ...state, user: action.payload as User };
    case CHANGE_PASSWORD:
      return { ...state, user: action.payload as User };
    default:
      return state;
  }
};

export default userReducer;
