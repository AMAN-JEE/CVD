import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import urls from '../constant.js';

const Stage3 = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [patientData, setPatientData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(`${urls.baseurl}/api/predict`);
        setPredictionResult(response.data);
      } catch (err) {
        setError("Error fetching prediction...");
      }
    };

    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${urls.baseurl}/api/patient-data`);
        setPatientData(response.data);
      } catch (err) {
        setError("Error fetching patient data.");
      }
    };

    fetchPrediction();
    fetchPatientData();
  }, []);

  const proceedToHome = () => {
    navigate("/");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Cardiovascular Disease Prediction Report", 20, 20);

    const details = [
      ["Name", patientData.name || "N/A"],
      ["Age", patientData.age || "N/A"],
      ["Gender", patientData.gender === 1 ? "Male" : "Female"],
      ["Chest Pain Type", patientData.chestPain ?? "N/A"],
      ["Serum Cholesterol", patientData.serumCholesterol ?? "N/A"],
      [
        "Exercise-Induced Angina",
        patientData.exerciseAngina === 1 ? "Yes" : "No",
      ],
      ["Major Vessels", patientData.majorVessels ?? "N/A"],
      ["Thallium Test", patientData.thalliumTest ?? "N/A"],
      ["Systolic Pressure", patientData.systolicPressure ?? "N/A"],
      ["Diastolic Pressure", patientData.diastolicPressure ?? "N/A"],
      ["Heart Rate", patientData.heartRate ?? "N/A"],
      ["Ecg Value", patientData.ecg ?? "N/A"],
      ["SpO2 Value", patientData.spo2 ?? "N/A"],
      [
        "Prediction",
        predictionResult?.prediction
          ? "Disease Detected"
          : "No Disease Detected",
      ],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: details,
    });

    doc.save(`${patientData.name}_CVD_Report.pdf`);
  };

  return (
    <div className="result-container">
      <h2>Heart Disease Prediction Result</h2>
      {error && <p className="error">{error}</p>}

      {predictionResult && patientData.name ? (
        <div className="result-data">
          <p>
            <b>Name:</b> {patientData.name}
          </p>
          <p>
            <b>Age:</b> {patientData.age}
          </p>
          <p>
            <b>Gender:</b> {patientData.gender === 1 ? "Male" : "Female"}
          </p>
          <p>
            <b>Chest Pain Type:</b> {patientData.chestPain}
          </p>
          <p>
            <b>Serum Cholesterol:</b> {patientData.serumCholesterol}
          </p>
          <p>
            <b>Exercise Angina:</b>{" "}
            {patientData.exerciseAngina === 1 ? "Yes" : "No"}
          </p>
          <p>
            <b>Major Vessels:</b> {patientData.majorVessels}
          </p>
          <p>
            <b>Thallium Test:</b> {patientData.thalliumTest}
          </p>
          <p>
            <b>Systolic Pressure:</b> {patientData.systolicPressure}
          </p>
          <p>
            <b>Diastolic Pressure:</b> {patientData.diastolicPressure}
          </p>
          <p>
            <b>Heart Rate:</b> {patientData.heartRate}
          </p>
          <p>
            <b>Ecg Value:</b> {patientData.ecg}
          </p>
          <p>
            <b>SpO2 Value:</b> {patientData.spo2}
          </p>
          <p>
            <b>Prediction:</b>{" "}
            {predictionResult.prediction ? (
              <span className="red">Disease Detected 💔</span>
            ) : (
              <span className="green">Wow! No Disease Detected</span>
            )}
          </p>
          <button onClick={downloadPDF}>Download Report</button>
        </div>
      ) : (
        <p>Loading patient data...</p>
      )}
      <div className="download-btn">
        <button onClick={proceedToHome}>Go To Home</button>
      </div>
    </div>
  );
};

export default Stage3;
