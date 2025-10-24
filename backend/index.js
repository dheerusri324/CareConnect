// backend/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import doctorRoutes from './routes/doctor.js'; // <-- Import doctor routes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/api', patientRoutes);
app.use('/api/doctor', doctorRoutes); // <-- Use doctor routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});