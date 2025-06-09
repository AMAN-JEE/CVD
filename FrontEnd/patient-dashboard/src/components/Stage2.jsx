import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from '../constant.js';

const Stage2 = () => {
  const [sensorData, setSensorData] = useState({
    heartRate: null,
    ecg: null,
    spo2: null,
  });
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [btndisable, setBtndisable] = useState(false);
  const navigate = useNavigate();

  // Effect to handle the countdown logic
  useEffect(() => {
    let timer = null;
    if (isActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // When countdown reaches zero, stop the timer
      setIsActive(false);
    }

    // Cleanup timer on component unmount or when the timer is inactive
    return () => clearInterval(timer);
  }, [isActive, countdown]);

  const startCountdown = () => {
    setCountdown(15); // Reset countdown to 10 seconds
    setIsActive(true); // Start the countdown
  };

  // Function to start sensor data reading
  const startSensorReading = async () => {
  try {
    // 1️⃣ First, SET FLAG = 1
    await axios.post(`${urls.baseurlsensor}/set-flag`, { value: 1 });
    console.log("✅ Sensor flag set to 1");

    // 2️⃣ Then start countdown and rest of the flow
    startCountdown();
    setBtndisable(true);

    setTimeout(async () => {
      try {
        setIsCollecting(true);

        // 3️⃣ Now call your start-sensor route
        const response = await axios.get(`${urls.baseurl}/api/start-sensor`);
        setSensorData(response.data);

        // (Optional) You can reset flag to 0 after collecting data:
        await axios.post(`${urls.baseurlsensor}/set-flag`, { value: 0 });
        console.log("✅ Sensor flag reset to 0");
      } catch (err) {
        setError("Error starting sensor data collection.");
      } finally {
        setIsCollecting(false);
      }
    }, 15000);
  } catch (err) {
    console.error("Error setting sensor flag:", err);
    setError("Error setting sensor flag.");
  }
};

  const proceedToStage3 = () => {
    navigate("/patient/predict");
  };

  return (
    <div className="sensor-container">
      <h2>Sensor Data Collection</h2>
      {error && <p className="error">{error}</p>}

      {isCollecting ? (
        <p>Collecting sensor data...</p>
      ) : (
        <>
          <p>
            {isActive ? (
              <>
                <b>Time remaining: {countdown} seconds </b>
              </>
            ) : (
              ""
            )}
          </p>
          <button onClick={startSensorReading} disabled={btndisable}>
            Start Reading
          </button>

          {sensorData.heartRate && (
            <div className="sensor-data">
              <p>
                <b>Heart Rate:</b> {sensorData.heartRate}
              </p>
              <p>
                <b>ECG:</b> {sensorData.ecg}
              </p>
              <p>
                <b>SpO2:</b> {sensorData.spo2}
              </p>
            </div>
          )}
          {sensorData.heartRate && (
            <div className="sensor-container">
              <button onClick={proceedToStage3}>Go Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Stage2;
