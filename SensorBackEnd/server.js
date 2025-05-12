import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Patient from "../Backend/models/patientModel.js";

const app = express();
const PORT = 4000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/CVD").then(() => {
    console.log("✅ Connected to MongoDB!");
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// Route to receive data from ESP8266
app.post("/data", async (req, res) => {
    try {
        console.log("📥 Received Request:", req.body);  // Log incoming data

        // Check if all required fields exist
        const { heartRate, spo2, ecg } = req.body;
        if (heartRate === undefined || spo2 === undefined || ecg === undefined) {
            console.log("❌ Missing Data Fields");
            return res.status(400).send("❌ Missing Data Fields");
        }

        // Save data to MongoDB
        const newData = new Patient({ heartRate, spo2, ecg });
        await newData.save();
        
        console.log("✅ Data successfully stored in MongoDB!");
        res.status(200).send("✅ Data saved to MongoDB");
    } catch (error) {
        console.error("❌ Error saving data:", error);
        res.status(500).send("❌ Server Error");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});