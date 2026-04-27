import express from "express";
import {
  addProduct,
  getVendorProducts,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/:vendorId", getVendorProducts);
router.delete("/:id", protect, deleteProduct);

export default router;