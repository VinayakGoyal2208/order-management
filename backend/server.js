import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url"; // Needed for ES Modules pathing

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

// 1. Resolve __dirname for ES Modules (Safest way to handle paths)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve the uploads folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. Optimized CORS
const allowedOrigins = [
  "http://localhost:5173", 
  "https://order-management-esny.onrender.com" 
];

app.use(cors((req, callback) => {
  const origin = req.get("origin");
  const host = req.get("host");
  const allowed = !origin || allowedOrigins.includes(origin) ||
    origin === `https://${host}` || origin === `http://${host}` ||
    origin === process.env.CLIENT_URL;
  callback(null, { origin: allowed, credentials: true });
}));

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.name);
    res.status(503).json({ msg: "Database unavailable" });
  }
});

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("B2B API is running..."));

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;