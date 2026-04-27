import express from "express";
import {
  createOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderStats, // Add this import
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/user", protect, getUserOrders);
router.get("/vendor", protect, getVendorOrders);

router.get("/stats", protect, getOrderStats); 

router.put("/:id", protect, updateOrderStatus);

export default router;