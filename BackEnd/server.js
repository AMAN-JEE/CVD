import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.URI;

// Middleware
app.use(cors());
app.use(express.json());

// Async function to connect to MongoDB and start the server
async function startServer() {
  try {
    // MongoDB connection
    await mongoose.connect(URI);

    console.log("✅ Connected to MongoDB!");

    // API Routes
    app.use("/api", apiRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process if DB connection fails
  }
}

startServer();
