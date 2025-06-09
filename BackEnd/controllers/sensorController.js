import Patient from "../models/patientModel.js";

// Simulated sensor data
const sensorData = {
  heartRate: null,
  ecg: null, // Simulated ECG readings
  spo2: null,
};

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

// Final export
export default {
  collectSensorData,
  sendPatientData,
};
