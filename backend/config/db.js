import mongoose from "mongoose";

let connection;

export default function connectDB() {
  connection ??= mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  }).catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}
