import express from 'express';
const router = express.Router();
import patientController from '../controllers/patientController.js';
import sensorController from '../controllers/sensorController.js';
import predictionController from '../controllers/predictionController.js';

// Stage-1: Store patient details
router.post('/patient-details', patientController.storePatientDetails);

// Stage-2: Start sensor data reading
router.get('/start-sensor', sensorController.collectSensorData);

// Stage-3: Predict heart disease based on data
router.get('/predict', predictionController.predictHeartDisease);

// Route to fetch patient data
router.get('/patient-data', sensorController.sendPatientData);

// Sensor Flag Control
router.get('/set-flag', sensorController.setSensorFlag);
router.get('/get-flag', sensorController.getSensorFlag);

export default router;
