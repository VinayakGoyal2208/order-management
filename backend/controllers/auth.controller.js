import { vendorLogoFields } from "../utils/vendorLogo.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/hashPassword.js";

/**
 * @desc    Personal Tab Registration (Regular Users)
 * Updated to prevent users from signing up if they are already Vendors
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check BOTH collections to prevent duplicate accounts across roles
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    const vendorExists = await Vendor.findOne({ $or: [{ email }, { phone }] });

    if (userExists || vendorExists) {
      return res.status(400).json({ msg: "An account already exists with this email/phone (User or Business)" });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ 
      name, 
      email, 
      phone, 
      password: hashed, 
      role: "user",
      status: "active" 
    });

    res.status(201).json({
      token: generateToken(user),
      role: user.role,
      user: { name: user.name }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @desc    Business Registration
 */
export const registerVendor = async (req, res) => {
  try {
    const { 
      companyName, ownerName, email, phone, 
      category, streetAddress, city, state, pincode, 
      password, image 
    } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // 1. STRICTOR CHECK: Ensure email doesn't exist in User OR Vendor models
    const userExists = await User.findOne({ email });
    const vendorExists = await Vendor.findOne({ email });
    
    if (userExists) {
       return res.status(400).json({ msg: "This email is already registered as a Personal User account." });
    }
    if (vendorExists) {
       return res.status(400).json({ msg: "This Business email is already registered." });
    }

    // 2. CATEGORY HANDLING: Parse stringified array from FormData
    let finalCategories = category;
    try {
      if (typeof category === 'string') {
        finalCategories = JSON.parse(category);
      }
    } catch (e) {
      finalCategories = category; // Fallback if it's already an array or plain string
    }

    const hashed = await hashPassword(password);

    await Vendor.create({
      companyName,
      ownerName,
      email,
      phone,
      category: finalCategories, 
      streetAddress,
      city,
      state,
      pincode,
      password: hashed,
      ...vendorLogoFields(req.file, image),
      role: "vendor",
      status: "pending" 
    });

    res.status(201).json({ 
      msg: "Application submitted successfully. Please wait for Admin approval." 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    console.error("CRITICAL ERROR:", err); 
    res.status(500).json({ msg: "Internal Server Error: " + err.message });
  }
};

/**
 * @desc    Combined Login with Role Enforcement
 */
export const login = async (req, res) => {
  try {
    const { email, password, targetRole } = req.body; // targetRole: 'user' or 'vendor'

    let account = await User.findOne({ email });
    if (!account) {
      account = await Vendor.findOne({ email });
    }

    if (!account) return res.status(404).json({ msg: "Account not found" });

    // 1. Role Enforcement based on Tab Selection
    if (targetRole === "user" && (account.role === "vendor" || account.role === "admin")) {
      return res.status(401).json({ msg: "Please use the Business tab for Staff/Vendor login." });
    }
    if (targetRole === "vendor" && account.role === "user") {
      return res.status(401).json({ msg: "Please use the Personal tab for User login." });
    }

    // 2. Check Vendor Approval Status
    if (account.role === "vendor" && account.status === "pending") {
      return res.status(403).json({ 
        msg: "Your business account is pending approval." 
      });
    }

    // 3. Verify Password
    const isMatch = await matchPassword(password, account.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // THE FIX: Added email to the returned user object
    res.json({
      token: generateToken(account),
      role: account.role,
      user: { 
        name: account.name || account.ownerName,
        email: account.email, // <--- ADDED THIS LINE
        company: account.companyName || null
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
