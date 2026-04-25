import axios from "./axios";

export const loginUser = (data) =>
  axios.post("/auth/login", data);

export const signupUser = (data) =>
  axios.post("/auth/signup", data);

export const acceptInviteAPI = (data) =>
  axios.post("/auth/invite", data);