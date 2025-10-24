// backend/routes/doctor.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { tokenRequired } from '../middleware/auth.js';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/doctor/appointments
router.get('/appointments', tokenRequired, async (req, res) => {
    // Ensure the logged-in user is a doctor
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access forbidden: User is not a doctor' });
    }

    try {
        // Find the doctor profile linked to the user account
        const doctor = await prisma.doctor.findUnique({
            where: { userId: req.user.id },
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const now = DateTime.now();
        const today = now.startOf('day');

        // Find all upcoming appointments for this doctor
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctor.id,
                // Filter for appointments that are today (but in the future) OR on a future date
                OR: [
                    {
                        appointment_date: { gte: today.toJSDate() },
                        appointment_time: { gte: now.toFormat('HH:mm') }
                    },
                    {
                        appointment_date: { gt: today.toJSDate() }
                    }
                ]
            },
            include: {
                patient: true, // Include the patient's user info
            },
            orderBy: [{ appointment_date: 'asc' }, { appointment_time: 'asc' }],
        });

        // Format the data for the frontend
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

export default router;