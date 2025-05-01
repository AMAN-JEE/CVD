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
  heartRate: { type: Number }, // Optional field
  systolicPressure: { type: Number, required: true },
  diastolicPressure: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
