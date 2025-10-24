// backend/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import doctorRoutes from './routes/doctor.js';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // Import url helper

dotenv.config();

// Helper to get the directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- SERVE STATIC FILES ---
// This makes the 'static' folder accessible to the browser
app.use('/static', express.static(path.join(__dirname, 'static')));


// API Routes
app.use('/auth', authRoutes);
app.use('/api', patientRoutes);
app.use('/api/doctor', doctorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});