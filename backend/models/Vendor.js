import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    companyName: String,
    ownerName: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    category: String,
    isActive: { type: Boolean, default: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);