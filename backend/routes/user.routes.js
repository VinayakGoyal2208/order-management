import express from "express";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- PUBLIC ---------------- */

// 🔹 GET ALL RESTAURANTS (Homepage - no login)
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ---------------- USER ---------------- */

// 🔹 GET MENU BY RESTAURANT
router.get("/menu/:restaurantId", async (req, res) => {
  try {
    const menu = await MenuItem.find({
      restaurant: req.params.restaurantId,
      available: true,
    });

    res.json(menu);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🔹 PLACE ORDER
router.post("/order", protect, async (req, res) => {
  const { restaurantId, items, total } = req.body;

  const order = await Order.create({
    user: req.user._id,
    restaurant: restaurantId,
    items,
    totalAmount: total,
  });

  res.json(order);
});

// 🔹 ORDER HISTORY
router.get("/orders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("restaurant")
    .populate("items.menuItem");

  res.json(orders);
});

export default router;