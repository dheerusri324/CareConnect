// backend/routes/doctor.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { tokenRequired } from '../middleware/auth.js';
import { DateTime } from 'luxon';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const router = express.Router();

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/');
    },
    filename: function (req, file, cb) {
        // Creates a unique filename: userId_timestamp.ext
        const uniqueSuffix = req.user.id + '_' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});
const upload = multer({ storage: storage });
// --- END MULTER ---

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

        const now = DateTime.now(); // Get current date and time

        // Fetch all appointments for this doctor from today onwards
        const appointmentsFromToday = await prisma.appointment.findMany({
            where: {
                doctorId: doctor.id,
                appointment_date: {
                    gte: now.startOf('day').toJSDate(), // Get appointments on or after the beginning of today
                },
            },
            include: {
                patient: true, // Include patient's user info for username
            },
            orderBy: [{ appointment_date: 'asc' }, { appointment_time: 'asc' }],
        });

        // --- PRECISE TIME FILTERING IN JAVASCRIPT ---
        // Filter out appointments that have already passed today
        const upcomingAppointments = appointmentsFromToday.filter(appt => {
            // Combine the DB date (which is DateTime but might be midnight UTC)
            // with the time string to get the correct local appointment time
            const apptDateTime = DateTime.fromJSDate(appt.appointment_date).setZone('local').set({
                hour: parseInt(appt.appointment_time.split(':')[0]),
                minute: parseInt(appt.appointment_time.split(':')[1]),
                second: 0,       // Ensure comparison starts exactly at the minute
                millisecond: 0
            });
            // Keep the appointment only if its time is >= the current time
            return apptDateTime >= now;
        });
        // --- END OF TIME FILTERING ---


        // Format the final list for the frontend
        const output = upcomingAppointments.map(appt => ({
            id: appt.id,
            patient_name: appt.patient.username,
            date: DateTime.fromJSDate(appt.appointment_date).toISODate(),
            time: appt.appointment_time,
            status: appt.status, // Status remains 'Scheduled' as these are all upcoming
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
