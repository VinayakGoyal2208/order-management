import express from "express";
import {
  createVendor,
  getVendors,
  deleteVendor,
} from "../controllers/vendor.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// This keeps your routes clean and organized
router.post("/", protect, authorize("admin"), createVendor);
router.get("/", getVendors);
router.delete("/:id", protect, authorize("admin"), deleteVendor);

export default router;