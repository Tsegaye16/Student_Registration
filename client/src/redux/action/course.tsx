import {
  GET_ALL_COURSE,
  ADD_COURSE,
  DELETE_COURSE,
} from "../../constant/actionType";
import * as api from "../api/api";

export const getAllCourse = () => async (dispatch: any) => {
  try {
    const response = await api.getAllCourse();
    console.log("API Response (should be an array): ", response.data);
    const data = await dispatch({
      type: GET_ALL_COURSE,
      payload: response.data,
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching courses: ", error.message);
    return { error: error.message || "Something went wrong" };
  }
};

export const addCourse = (courseData: any) => async (dispatch: any) => {
  try {
    const response = await api.addCourse(courseData);
    const data = await dispatch({
      type: ADD_COURSE,
      payload: response.data,
    });
    return data;
  } catch (error: any) {
    console.log("error: ", error);
    const errorMessage = error.response?.data?.message;

    return { error: errorMessage };
  }
};

export const deleteCourse = (id: string[]) => async (dispatch: any) => {
  try {
    const response = await api.deleteCourse(id);

    const data = await dispatch({
      type: DELETE_COURSE,
      payload: response.data,
    });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    return { error: errorMessage };
  }
};
