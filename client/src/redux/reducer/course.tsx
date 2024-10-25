import {
  GET_ALL_COURSE,
  ADD_COURSE,
  DELETE_COURSE,
} from "../../constant/actionType";

const courseState = {
  courseData: null,
};

const courseReducer = (state = courseState, action: any) => {
  switch (action.type) {
    case GET_ALL_COURSE:
      return { ...state, courseData: action.payload };
    case ADD_COURSE:
      return { ...state, courseData: action.payload };
    case DELETE_COURSE:
      return { ...state, courseData: action.payload };
    default:
      return state;
  }
};

export default courseReducer;
