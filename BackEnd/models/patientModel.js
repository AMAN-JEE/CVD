import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: Number, required: true },
  chestPain: { type: Number, required: true },
  serumCholesterol: { type: Number, required: true },
  exerciseAngina: { type: Number, required: true },
  majorVessels: { type: Number, required: true },
  thalliumTest: { type: Number, required: true },
  systolicPressure: { type: Number, required: true },
  diastolicPressure: { type: Number, required: true },
  heartRate: { type: Number, default: 80 }, // Optional field
  ecg: { type: Number, default: 0  }, // Optional field
  spo2: { type: Number, default: 96.5  }, // Optional field
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
