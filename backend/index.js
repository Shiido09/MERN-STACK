// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import brandRoutes from "./routes/brand.route.js";
import productRoutes from "./routes/product.route.js"; // Import product routes
import blogRoutes from "./routes/blog.route.js"; 
import orderRoutes from "./routes/order.route.js";// Import blog routes
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: "http://localhost:5173", // Adjust this as necessary
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes); // Add product routes
app.use("/api/blogs", blogRoutes);
app.use("/api/orders", orderRoutes); // Add blog routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start server and connect to database
app.listen(PORT, async () => {
  await connectDB(); // Connect to MongoDB
  console.log("Server is running on port:", PORT);
});
