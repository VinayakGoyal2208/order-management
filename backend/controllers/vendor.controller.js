import Vendor from "../models/Vendor.js";
import { hashPassword } from "../utils/hashPassword.js";

export const createVendor = async (req, res) => {
  try {
    const { companyName, ownerName, email, password, phone, address, category, image } = req.body;

    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Vendor already exists" });

    const hashed = await hashPassword(password);

    const vendor = await Vendor.create({
      business: {
        companyName,
        address,
      },
      ownerName,
      email,
      password: hashed,
      phone,
      category,
      image: image || "", 
    });

    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};