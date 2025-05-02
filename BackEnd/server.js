import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import apiRoutes from "./routes/apiRoutes.js";
import Patient from "./models/patientModel.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/CVD")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// API Routes
app.use("/api", apiRoutes);

// Route to receive data from ESP8266
app.post("/data", async (req, res) => {
  try {
    console.log("📥 Received Request:", req.body); // Log incoming data

    // Check if all required fields exist
    const { heartRate, spo2, ecgSignal } = req.body;
    if (
      heartRate === undefined ||
      spo2 === undefined ||
      ecgSignal === undefined
    ) {
      console.log("❌ Missing Data Fields");
      return res.status(400).send("❌ Missing Data Fields");
    }

    // Retrieve the most recent patient record (from Stage-1)
    const patient = await Patient.findOne().sort({ createdAt: -1 }).exec();

    if (!patient) {
      return res
        .status(404)
        .json({ error: "No patient data found to update." });
    }

    // Update patient document with sensor data
    patient.heartRate = heartRate;
    patient.ecg = ecgSignal;
    patient.spo2 = spo2;

    // Save the updated patient data
    await patient.save();
    console.log("✅ Data successfully stored in MongoDB!");
    res.status(200).send("✅ Data saved to MongoDB");
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).send("❌ Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
