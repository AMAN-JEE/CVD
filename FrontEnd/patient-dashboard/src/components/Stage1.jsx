import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router for redirection

const Stage1 = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    chestPain: "",
    serumCholesterol: "",
    exerciseAngina: "",
    majorVessels: "",
    thalliumTest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const resetFunction = () => {
    setPatientData({
      name: "",
      age: "",
      gender: "",
      chestPain: "",
      serumCholesterol: "",
      exerciseAngina: "",
      majorVessels: "",
      thalliumTest: "",
    });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/patient-details", patientData);
      alert("Data submitted successfully!");
      navigate("/stage-2"); // Redirect to Stage-2 after success
    } catch (error) {
      setError("Error submitting data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Stage-1: Enter Patient Details</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Patient form fields */}
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={patientData.name}
          onChange={handleInputChange}
          required
        />
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={patientData.age}
          onChange={handleInputChange}
          required
        />
        {patientData.age && (patientData.age < 1 || patientData.age > 100) && (
          <p className="error">Please enter a value between 1 and 100.</p>
        )}

        <label>Gender:</label>
        <select
          name="gender"
          value={patientData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="1">Male</option>
          <option value="0">Female</option>
        </select>

        <label>Chest Pain Type:</label>
        <select
          name="chestPain"
          value={patientData.chestPain}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Chest Pain</option>
          <option value="1">1. Typical Angina</option>
          <option value="2">2. Atypical Angina</option>
          <option value="3">3. Non-anginal Pain</option>
          <option value="4">4. Asymptomatic</option>
        </select>

        <label>Serum Cholesterol: (mg/dL)</label>
        <input
          type="number"
          name="serumCholesterol"
          value={patientData.serumCholesterol}
          onChange={handleInputChange}
          min="100"
          max="600"
          required
        />
        {patientData.serumCholesterol &&
          (patientData.serumCholesterol < 100 ||
            patientData.serumCholesterol > 600) && (
            <p className="error">
              Please enter a value between 100 and 600 mg/dL.
            </p>
          )}

        <label>Exercise-Induced Angina:</label>
        <div className="radio-btn">
          <label>
            <input
              type="radio"
              name="exerciseAngina"
              value="1"
              checked={patientData.exerciseAngina === "1"} // Check if "true" is selected
              onChange={handleInputChange}
              required
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="exerciseAngina"
              value="0"
              checked={patientData.exerciseAngina === "0"} // Check if "false" is selected
              onChange={handleInputChange}
              required
            />
            No
          </label>
        </div>

        <label>Number of Major Vessels Colored by Fluoroscopy:</label>
        <select
          name="majorVessels"
          value={patientData.majorVessels}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Major Vessels Colored by Fluoroscopy</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>

        <label>Thallium Stress Test Result:</label>
        <select
          name="thalliumTest"
          value={patientData.thalliumTest}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Thallium Stress Type</option>
          <option value="3">3. Normal (no defects)</option>
          <option value="6">
            6. Fixed defect (a defect that doesn’t change between stress and
            rest)
          </option>
          <option value="7">
            7. Reversible defect (a defect present during stress but not at
            rest)
          </option>
        </select>

        <div className="sub-btn">
          <button onClick={resetFunction}>
            Reset
          </button>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Stage1;
