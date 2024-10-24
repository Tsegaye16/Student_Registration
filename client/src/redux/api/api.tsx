import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/user",
});

export const signIn = async (formData: any) => API.post("/signin", formData);

export const signUp = async (formData: any) => API.post("/signup", formData);

export const getUserById = async (userId: string) =>
  API.get(`/getuser/${userId}`);

export const updateProfile = async (id: any, data: any) =>
  API.put(`/updateprofile/${id}`, data);

export const changePassword = async (password: any) =>
  API.put("/changepassword", password);

export const emailConfirmation = async (token: any) =>
  API.get(`/confirm-email/${token}`);
