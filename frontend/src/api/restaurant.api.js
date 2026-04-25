import axios from "./axios";

export const getRestaurantOrders = () =>
  axios.get("/restaurant/orders");

export const updateOrder = (id, status) =>
  axios.put(`/restaurant/order/${id}`, { status });