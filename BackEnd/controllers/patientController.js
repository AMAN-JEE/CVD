import Patient from '../models/patientModel.js';

// Controller function to store patient details (Stage-1)
const storePatientDetails = async (req, res) => {
    const { name, age, gender, chestPain, serumCholesterol, exerciseAngina, majorVessels, thalliumTest } = req.body;
    
    try {
        const patient = new Patient({
            name,
            age,
            gender,
            chestPain,
            serumCholesterol,
            exerciseAngina,
            majorVessels,
            thalliumTest,
        });
        await patient.save();
        res.status(200).json({ message: 'Patient details saved successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving patient details.' });
    }
};

export default { storePatientDetails };
