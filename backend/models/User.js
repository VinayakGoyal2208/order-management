import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "restaurant", "admin"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);