import Patient from "../models/patientModel.js";
import { RandomForestClassifier } from "ml-random-forest";
import Papa from "papaparse";
import fs from "fs"; // File system module to read CSV files

// Function to load and parse the CSV file
const loadCSVData = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileData = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileData, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        // Split the data into features (inputs) and labels (outputs)
        const inputs = [];
        const outputs = [];

        result.data.forEach((row) => {
          // Handle missing values by skipping invalid rows
          if (
            row.age &&
            row.gender !== null &&
            row.chestPain &&
            row.serumCholesterol &&
            row.exerciseAngina !== null &&
            row.majorVessels !== null &&
            row.thalliumTest &&
            row.bloodPressure &&
            row.heartRate && 
            row.restingElectro
          ) {
            // Push numeric data into the inputs array
            inputs.push([
              row.age,
              row.gender,
              row.chestPain,
              row.serumCholesterol,
              row.exerciseAngina,
              row.majorVessels,
              row.thalliumTest,
              row.bloodPressure,
              row.heartRate,
              row.restingElectro,
            ]);
            outputs.push(row.disease);
          }
        });

        resolve({ inputs, outputs });
      },
      error: (error) => reject(error),
    });
  });
};

// Function to calculate performance metrics
const calculateMetrics = (yTrue, yPred) => {
  let tp = 0,
    tn = 0,
    fp = 0,
    fn = 0;

  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++; // True Positive
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++; // True Negative
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++; // False Positive
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++; // False Negative
  }
  console.log(`[TP:${tp} FP:${fp}] \n[FN:${fn} TN:${tn}] `);
  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = 2 * ((precision * recall) / (precision + recall)) || 0;

  return { accuracy, precision, recall, f1Score };
};

// Train Random Forest model using data from CSV
const trainRandomForestFromCSV = async () => {
  try {
    const { inputs, outputs } = await loadCSVData("./Dataset/data.csv");

    // Ensure all input data is numeric
    const numericInputs = inputs.map((input) =>
      input.map((value) =>
        typeof value === "string" ? parseFloat(value) : value
      )
    );

    // Split the data into training and testing sets (80% train, 20% test)
    const trainSize = Math.floor(numericInputs.length * 0.8);
    const xTrain = numericInputs.slice(0, trainSize);
    const yTrain = outputs.slice(0, trainSize);
    const xTest = numericInputs.slice(trainSize);
    const yTest = outputs.slice(trainSize);

    // Initialize and train the Random Forest model
    const rf = new RandomForestClassifier({
      nEstimators: 100, // Number of trees
    });

    rf.train(xTrain, yTrain);
    console.log("Random Forest model trained successfully");

    // Make predictions on the test set
    const predictions = rf.predict(xTest);

    // Calculate performance metrics
    const { accuracy, precision, recall, f1Score } = calculateMetrics(
      yTest,
      predictions
    );

    console.log(`Accuracy: ${accuracy}`);
    console.log(`Precision: ${precision}`);
    console.log(`Recall: ${recall}`);
    console.log(`F1 Score: ${f1Score}`);

    return rf; // Return the trained model for later use
  } catch (error) {
    console.error("Error training the Random Forest model from CSV:", error);
  }
};

// Train the Random Forest model when the script is loaded
let model;
trainRandomForestFromCSV()
  .then((trainedModel) => {
    model = trainedModel; // Store the trained model for later use
  })
  .catch((error) => {
    console.error("Error during Random Forest model training:", error);
  });

// Controller function for heart disease prediction (Stage-3)
const predictHeartDisease = async (req, res) => {
  try {
    // Retrieve the most recent patient data
    const patient = await Patient.findOne().sort({ createdAt: -1 }).exec();
    if (!patient) {
      return res.status(404).json({ error: "No patient data found." });
    }

    // Prepare input data for the Random Forest model
    const inputData = [
      patient.age,
      patient.gender,
      patient.chestPain,
      patient.serumCholesterol,
      patient.exerciseAngina,
      patient.majorVessels,
      patient.thalliumTest,
      patient.bloodPressure,
      patient.heartRate,
      patient.restingElectro
    ];

    // Make prediction using the trained Random Forest model
    const prediction = model.predict([inputData]);
    const result = prediction[0] >= 0.5 ? 1 : 0; // Classify based on threshold
    res.status(200).json({
      prediction: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Error predicting heart disease." });
  }
};

export default { predictHeartDisease };
