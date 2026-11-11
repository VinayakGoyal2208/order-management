// services/api.js
import axios from "axios";

const origin = (import.meta.env.VITE_API_ORIGIN || "").replace(/\/$/, "");
const BASE_URL = `${origin}/api`;

export function getImageUrl(value) {
  if (!value) return "";
  if (/^(https?:|data:)/i.test(value)) return value;
  const path = value.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${origin}/${path}`;
}

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Admin Vendor Management
export const fetchAllVendors = () => API.get("/admin/all-vendors");
export const createVendor = (formData) => API.post("/admin/create-vendor", formData);
export const deleteVendor = (id) => API.delete(`/admin/${id}`);
export const updateVendor = (id, status) => API.patch(`/admin/status/${id}`, { status });
export const updateProfile = (formData) => API.put("/users/profile", formData);

export default API;