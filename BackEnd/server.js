import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // No need for body-parser

// Async function to connect to MongoDB and start the server
async function startServer() {
  try {
    // MongoDB connection
    await mongoose.connect(
      "mongodb+srv://cvdproject:cvd123456@cvd-cluster.arfmy9f.mongodb.net/CVD_DB?retryWrites=true&w=majority&appName=CVD-CLUSTER/"
    );

    console.log("✅ Connected to MongoDB!");

    // After successful connection, start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process with failure if DB connection fails
  }
}

// Call the startServer function
startServer();

// API Routes
app.use("/api", apiRoutes);
