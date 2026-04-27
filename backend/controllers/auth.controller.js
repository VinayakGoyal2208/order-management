import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/hashPassword.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(400).json({ msg: "User with this email or phone already exists" });

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
    });

    res.json({ 
      token: generateToken(user),
      role: user.role,
      user: { name: user.name } 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check User Collection (This handles Users AND Admins)
    let user = await User.findOne({ email });

    if (user && (await matchPassword(password, user.password))) {
      return res.json({
        token: generateToken(user),
        role: user.role, // This will return "admin" or "user"
        user: { name: user.name } // REQUIRED for your new AuthContext
      });
    }

    // 2. Check Vendor Collection (If not found in User collection)
    let vendor = await Vendor.findOne({ email });

    if (vendor && (await matchPassword(password, vendor.password))) {
      return res.json({
        token: generateToken({ _id: vendor._id, role: "vendor" }),
        role: "vendor",
        user: { name: vendor.ownerName } // Correctly mapping ownerName to name
      });
    }

    res.status(400).json({ msg: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};