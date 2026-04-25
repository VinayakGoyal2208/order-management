import API from "./axios";

// 📊 ADMIN STATS
export const getAdminStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

// 👤 USERS
export const getUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

// 🍽️ RESTAURANTS
export const getRestaurantsAdmin = async () => {
  const res = await API.get("/admin/restaurants");
  return res.data;
};

export const deleteRestaurant = async (id) => {
  const res = await API.delete(`/admin/restaurants/${id}`);
  return res.data;
};

// ➕ CREATE RESTAURANT (NO TOKEN)
export const createRestaurant = async (data) => {
  const res = await API.post("/admin/create-restaurant", data);
  return res.data;
};