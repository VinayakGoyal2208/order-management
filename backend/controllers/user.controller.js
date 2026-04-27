import User from "../models/User.js";

// Admin view: Get all users
// controllers/user.controller.js
export const getAllUsers = async (req, res) => {
  try {
    // Explicitly select the fields to be 100% sure
    const users = await User.find()
      .select("name email phone role createdAt") 
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin action: Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};