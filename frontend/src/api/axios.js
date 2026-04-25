import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createRestaurant = async (data) => {
  const res = await instance.post("/admin/create-restaurant", data);
  return res.data;
};

// ✅ ADD TOKEN AUTOMATICALLY
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;