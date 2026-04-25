import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* =========================
   SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ user, token });

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

/* =========================
   LOGIN (FIXED)
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    

    // 1️⃣ validate input FIRST
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // 2️⃣ find user
    const user = await User.findOne({ email });
    

   console.log("USER FOUND:", user);
    console.log("INPUT PASSWORD:", password);
    console.log("DB PASSWORD:", user?.password);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // 3️⃣ compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // 4️⃣ generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      msg: "Login successful",
      user,
      token,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;