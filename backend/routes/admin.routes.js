import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* =========================
   📊 STATS (NO AUTH)
========================= */
router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "user" });
    const restaurants = await User.countDocuments({ role: "restaurant" });
    const orders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const revenue = revenueData[0]?.total || 0;

    res.json({ users, restaurants, orders, revenue });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* =========================
   👤 USERS
========================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* =========================
   🗑 DELETE USER
========================= */
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* =========================
   🍽 RESTAURANTS LIST
========================= */
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* =========================
   🗑 DELETE RESTAURANT
========================= */
router.delete("/restaurants/:id", async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ msg: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* =========================
   ➕ CREATE RESTAURANT (NO TOKEN)
========================= */
router.post("/create-restaurant", async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create restaurant profile
    await Restaurant.create({
      name,
      email,
      phone,
      address,
    });

    // create user
    await User.create({
      name,
      email,
      phone,
      address,
      role: "restaurant",
      password: hashedPassword,
    });

    res.json({ msg: "Restaurant created successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;

