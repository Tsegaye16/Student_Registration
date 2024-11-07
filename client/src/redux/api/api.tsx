import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/user",
});

// User Authentication
export const signIn = async (formData: { email: string; password: string }) => {
  try {
    return await API.post("/signin", formData);
  } catch (error) {
    console.error("Error signing in:", error);
    throw error; // Rethrow or handle as needed
  }
};

export const signUp = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    return await API.post("/signup", formData);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// User Profile Management
export const getUserById = async (userId: string) => {
  try {
    return await API.get(`/getuser/${userId}`);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (id: string, data: any) => {
  try {
    return await API.put(`/updateprofile/${id}`, data);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (password: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    return await API.put("/changepassword", password);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const emailConfirmation = async (token: string) => {
  try {
    return await API.get(`/confirm-email/${token}`);
  } catch (error) {
    console.error("Error confirming email:", error);
    throw error;
  }
};

// Course Management
export const getAllCourses = async () => {
  try {
    return await API.get("/getAllCourse");
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const addCourse = async (courseData: any) => {
  try {
    return await API.post("/addCourse", courseData);
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const deleteCourse = async (id: string[]) => {
  try {
    return await API.delete("/deleteCourse", { data: { ids: id } });
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

export const updateCourse = async (id: string, data: any) => {
  try {
    return await API.put(`/updateCourse/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const getAllStudent = async () => {
  try {
    return await API.get("/getAllStudent");
  } catch (error) {
    throw error;
  }
};

export const getStudentById = async (id: string) => {
  try {
    return await API.get(`/getStudentById/${id}`);
  } catch (error) {
    throw error;
  }
};

export const addStudent = async (data: any) => {
  try {
    return await API.post("/addStudent", data);
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (id: string[]) => {
  try {
    return await API.delete("/deleteStudent", { data: { ids: id } });
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const updateStudent = async (id: string, data: any) => {
  try {
    return await API.put(`/updateStudent/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const markAttendance = async (data: any) => {
  try {
    return await API.put("/markAttendance", data);
  } catch (error) {
    throw error;
  }
};
