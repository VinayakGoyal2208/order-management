import express from "express";
import { 
  login, 
  registerUser, 
  registerVendor
} from "../controllers/auth.controller.js";
import vendorLogoUpload from "../middleware/vendorLogoUpload.js";

const router = express.Router();

// Public routes - NO PROTECTION NEEDED
router.post("/login", login);
router.post("/register", registerUser);
router.post("/register-vendor", vendorLogoUpload, registerVendor);

export default router;