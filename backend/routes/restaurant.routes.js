import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/orders", protect, allowRoles("restaurant"), async (req, res) => {
  const orders = await Order.find({ restaurant: req.user._id })
    .populate("user");

  res.json(orders);
});

router.put("/order/:id", protect, allowRoles("restaurant"), async (req, res) => {
  const order = await Order.findById(req.params.id);

  order.status = req.body.status;

  await order.save();

  res.json(order);
});

// menu management
router.post("/menu", protect, async (req, res) => {
  const item = await MenuItem.create({
    ...req.body,
    restaurant: req.user.id,
  });
  res.json(item);
});

export default router;