// backend/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import doctorRoutes from './routes/doctor.js';
import reviewRoutes from './routes/review.js'; // <-- Import review routes
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (for profile pics)
app.use('/static', express.static(path.join(__dirname, 'static')));

// API Routes
app.use('/auth', authRoutes);
app.use('/api', patientRoutes); // Includes /api/doctors, /api/my-appointments etc.
app.use('/api/doctor', doctorRoutes); // Includes /api/doctor/appointments, /api/doctor/profile-pic
app.use('/api', reviewRoutes); // <-- Use review routes (includes /api/reviews)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});