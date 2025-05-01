import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router for redirection
import axios from "axios";

const Stage3 = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [patientData, setPatientData] = useState({});
  const navigate = useNavigate(); // Hook for navigation
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        // const response = await axios.get("/api/predict");
        // setPredictionResult(response.data);
      } catch (err) {
        setError("Error fetching prediction...");
      }
    };

    fetchPrediction();
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get("/api/patient-data");
        setPatientData(response.data);
      } catch (err) {
        setError("Error fetching Patient data.");
      }
    };

    fetchPatientData();
  }, []);

  const proceedToHome = () => {
    navigate("/");
  };

  return (
    <div className="result-container">
      <h2>Stage-3: Heart Disease Prediction Result</h2>
      {error && <p className="error">{error}</p>}

      {predictionResult ? (
        <div className="result-data">
          <p>
            <b>Name: </b>
            {patientData.name}
          </p>
          <p>
            <b>Age: </b>
            {patientData.age}
          </p>
          <p>
            <b>Gender: </b>
            {patientData.gender ? "Male" : "Female"}
          </p>
          <p>
            <b>Heart Disease Prediction:</b>{" "}
            {predictionResult.prediction ? (
              <span className="red">Disease Detected</span>
            ) : (
              <span className="green">Disease Not Detected</span>
            )}
          </p>
        </div>
      ) : (
        <p>Loading prediction...</p>
      )}

      <button onClick={proceedToHome}>Back to Home</button>
    </div>
  );
};

export default Stage3;
