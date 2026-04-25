import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
      },
      qty: Number,
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["processing", "confirmed", "delivered"],
    default: "processing",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);