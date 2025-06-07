import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseurl from "../constant.js";

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
    setCountdown(10); // Reset countdown to 10 seconds
    setIsActive(true); // Start the countdown
  };

  // Function to start sensor data reading
  // const startSensorReading = async () => {
  //   startCountdown();
  //   setBtndisable(true);

  //   setTimeout(async () => {
  //     try {
  //       setIsCollecting(true);
  //       const response = await axios.get(`${baseurl}/api/start-sensor`);
  //       setSensorData(response.data); // Simulating real-time data fetch
  //     } catch (err) {
  //       setError("Error starting sensor data collection.");
  //     } finally {
  //       setIsCollecting(false);
  //     }
  //   }, 3000);
  // };

  const startSensorReading = async () => {
  try {
    // 1️⃣ Set flag = 1 → tell ESP to start collecting
    await axios.get(`${baseurl}/set-flag?value=1`);

    startCountdown();
    setBtndisable(true);

    setTimeout(async () => {
      try {
        setIsCollecting(true);

        // 2️⃣ Call start-sensor API → this will return collected data
        const response = await axios.get(`${baseurl}/api/start-sensor`);
        setSensorData(response.data);

      } catch (err) {
        setError("Error starting sensor data collection.");
      } finally {
        setIsCollecting(false);
        await new Promise(resolve => setTimeout(resolve, 2000));  // small wait
        // 3️⃣ Reset flag = 0 → tell ESP to stop collecting
        await axios.get(`${baseurl}/set-flag?value=0`);
      }
    }, 10000);

  } catch (err) {
    setError("Error setting sensor flag.");
  }
};


  const proceedToStage3 = () => {
    navigate("/stage-3");
  };

  return (
    <div className="sensor-container">
      <h2>Stage-2: Sensor Data Collection</h2>
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
              <button onClick={proceedToStage3}>Proceed Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Stage2;
