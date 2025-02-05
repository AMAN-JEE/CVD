import Patient from "../models/patientModel.js";

// Simulated sensor data
const sensorData = {
  bloodPressure: 112,
  heartRate: 125,
  ecg: [1.2, 0.5, -0.3, 0.8, 0.9], // Simulated ECG readings
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
    patient.heartRate = sensorData.heartRate;
    patient.bloodPressure = sensorData.bloodPressure;
    patient.ecg = sensorData.ecg;

    // Save the updated patient data
    await patient.save();
    res.status(200).json(sensorData);
    // res.status(200).json({ message: 'Sensor data collected and patient data updated successfully.' });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error collecting and updating sensor data." });
  }
};

const sendPatientData = async (req, res) => {
  try {
    // Retrieve the most recent patient record (from Stage-1)
    const patient = await Patient.findOne().sort({ createdAt: -1 }).exec();

    if (!patient) {
      return res.status(404).json({ error: "No patient data found!!" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Error in fetching the data." });
  }
};

export default { collectSensorData, sendPatientData };
