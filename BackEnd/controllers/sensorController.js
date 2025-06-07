import Patient from "../models/patientModel.js";

// Simulated sensor data
const sensorData = {
  heartRate: null,
  ecg: null, // Simulated ECG readings
  spo2: null,
};

// Sensor flag variable
let sensorFlag = 0;  // 0 = idle, 1 = start reading

// Controller function to collect sensor data (Stage-2) and update patient data
const collectSensorData = async (req, res) => {
  try {
    // Retrieve the most recent patient record (from Stage-1)
    const patient = await Patient.findOne().sort({ createdAt: -1 }).exec();

    if (!patient) {
      return res
        .status(404)
        .json({ error: "No patient data found to update." });
    }

    // Update patient document with sensor data
    sensorData.heartRate = patient.heartRate;
    sensorData.ecg = patient.ecg;
    sensorData.spo2 = patient.spo2;

    // Save the updated patient data
    await patient.save();
    res.status(200).json(sensorData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error collecting and updating sensor data." });
  }
};

// Send patient data (used in /patient-data route)
const sendPatientData = async (req, res) => {
  try {
    const patient = await Patient.findOne().sort({ createdAt: -1 }).exec();

    if (!patient) {
      return res.status(404).json({ error: "No patient data found!!" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Error in fetching the data." });
  }
};

// NEW: Set sensorFlag from frontend
const setSensorFlag = (req, res) => {
  const value = parseInt(req.query.value);
  if (isNaN(value) || (value !== 0 && value !== 1)) {
    return res.status(400).json({ error: "Invalid flag value" });
  }

  sensorFlag = value;
  console.log(`Sensor flag updated to: ${sensorFlag}`);
  res.status(200).json({ status: "ok", flag: sensorFlag });
};

// NEW: Get sensorFlag (polled by ESP8266)
const getSensorFlag = (req, res) => {
  res.status(200).json({ flag: sensorFlag });
};

// Final export
export default {
  collectSensorData,
  sendPatientData,
  setSensorFlag,
  getSensorFlag,
};
