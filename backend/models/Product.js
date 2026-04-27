import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    stock: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);