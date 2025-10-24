// backend/routes/doctor.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { tokenRequired } from '../middleware/auth.js';
import { DateTime } from 'luxon';
import multer from 'multer'; // For file uploads
import path from 'path';   // For handling file paths

const prisma = new PrismaClient();
const router = express.Router();

// --- MULTER CONFIGURATION FOR FILE UPLOADS ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Saves files to the 'static/uploads' folder in the backend
        cb(null, 'static/uploads/');
    },
    filename: function (req, file, cb) {
        // Creates a unique filename to prevent conflicts
        const uniqueSuffix = req.user.id + '_' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
// --- END OF MULTER CONFIGURATION ---


// GET /api/doctor/appointments
router.get('/appointments', tokenRequired, async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access forbidden: User is not a doctor' });
    }

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { userId: req.user.id },
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const now = DateTime.now();
        const today = now.startOf('day');

        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctor.id,
                OR: [
                    {
                        appointment_date: today.toJSDate(),
                        appointment_time: { gte: now.toFormat('HH:mm') }
                    },
                    {
                        appointment_date: { gt: today.toJSDate() }
                    }
                ]
            },
            include: {
                patient: true,
            },
            orderBy: [{ appointment_date: 'asc' }, { appointment_time: 'asc' }],
        });

        const output = appointments.map(appt => ({
            id: appt.id,
            patient_name: appt.patient.username,
            date: DateTime.fromJSDate(appt.appointment_date).toISODate(),
            time: appt.appointment_time,
            status: appt.status,
        }));

        res.json({ appointments: output });
    } catch (error) {
        console.error("Error fetching doctor's appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
});


// POST /api/doctor/profile-pic
router.post('/profile-pic', tokenRequired, upload.single('profile_pic'), async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access forbidden' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        await prisma.doctor.update({
            where: { userId: req.user.id },
            data: { profile_pic: req.file.filename },
        });
        res.json({ message: 'Profile picture updated successfully', filename: req.file.filename });
    } catch (error) {
        console.error("Profile pic update error:", error);
        res.status(500).json({ message: 'Database update failed' });
    }
});


export default router;