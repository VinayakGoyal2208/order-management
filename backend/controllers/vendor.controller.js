import { vendorLogoFields } from "../utils/vendorLogo.js";
import Vendor from "../models/Vendor.js";
import { hashPassword } from "../utils/hashPassword.js";

/**
 * CREATE VENDOR
 * Handles both Admin Direct Onboarding and Public Applications
 */
export const createVendor = async (req, res) => {
  try {
    const {
      companyName, ownerName, email, phone,
      category, streetAddress, city, state,
      pincode, password, status
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Vendor already exists" });

    const hashed = await hashPassword(password);

    // Matches your Flat Mongoose Schema exactly for maximum visibility
    const vendor = await Vendor.create({
      companyName,
      ownerName,
      email,
      phone,
      category,
      streetAddress,
      city,
      state,
      pincode,
      password: hashed,
      ...vendorLogoFields(req.file, req.body.image),
      status: status || "pending"
    });

    const publicVendor = vendor.toObject();
    delete publicVendor.logoBytes;
    delete publicVendor.logoContentType;
    delete publicVendor.password;

    res.status(201).json({
      msg: vendor.status === "active" ? "Vendor onboarded successfully!" : "Application submitted for approval!",
      vendor: publicVendor
    });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

/**
 * GET ALL VENDORS
 */
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .select("companyName ownerName category city state logo")
      .sort({ createdAt: -1 })
      .lean();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * GET SINGLE VENDOR (For Edit Modal/Details View)
 */
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select("-password").lean();
    if (!vendor) return res.status(404).json({ msg: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    // We use $set to only update the fields provided in req.body
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!vendor) return res.status(404).json({ msg: "Vendor not found" });

    res.json({
      msg: "Update successful",
      vendor: vendor
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * DELETE VENDOR
 */
export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const getVendorLogo = async (req, res) => {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.sendStatus(404);
  const vendor = await Vendor.findById(req.params.id).select("logoBytes logoContentType");
  if (!vendor?.logoBytes || !vendor.logoContentType) return res.sendStatus(404);

  res.set("X-Content-Type-Options", "nosniff");
  res.set("Cache-Control", "public, max-age=300");
  res.type(vendor.logoContentType).send(Buffer.from(vendor.logoBytes));
};
