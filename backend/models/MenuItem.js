import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  name: String,
  price: Number,
  category: String,
  image: String,
  available: { type: Boolean, default: true },
});

export default mongoose.model("MenuItem", menuSchema);