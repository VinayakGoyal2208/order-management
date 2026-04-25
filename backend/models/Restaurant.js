import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Restaurant", restaurantSchema);