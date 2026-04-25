import axios from "./axios";

export const getRestaurants = async () => {
  const res = await axios.get("/user/restaurants");
  return res.data;
};

export const getMenu = (id) =>
  axios.get(`/user/menu/${id}`);

export const placeOrder = (data) =>
  axios.post("/user/order", data);

export const getOrders = () =>
  axios.get("/user/orders");