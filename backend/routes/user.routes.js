import express from "express";
import { getAllUsers, deleteUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin only: View all registered users (shows Name, Email, Phone, Date)
router.get("/", protect, authorize("admin"), getAllUsers);

// Admin only: Delete a user
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;