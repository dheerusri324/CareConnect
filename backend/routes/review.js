// backend/routes/review.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { tokenRequired } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/reviews
router.post('/reviews', tokenRequired, async (req, res) => {
    const { appointment_id, rating, comment } = req.body;
    const patientId = req.user.id;

    if (!appointment_id || !rating) {
        return res.status(400).json({ message: 'Appointment ID and rating are required' });
    }

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(appointment_id) }
        });

        // Security checks
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (appointment.patientId !== patientId) {
            return res.status(403).json({ message: 'You can only review your own appointments' });
        }
        // Check if review already exists using the unique appointmentId constraint
        const existingReview = await prisma.review.findUnique({
             where: { appointmentId: parseInt(appointment_id) }
        });
        if (existingReview) {
             return res.status(409).json({ message: 'A review for this appointment already exists' });
        }


        // Create the new review
        const newReview = await prisma.review.create({
            data: {
                doctorId: appointment.doctorId,
                patientId: patientId,
                appointmentId: parseInt(appointment_id),
                rating: parseInt(rating),
                comment: comment || null, // Allow optional comment
            }
        });

        res.status(201).json({ message: 'Review submitted successfully', review: newReview });

    } catch (error) {
        console.error("Review submission error:", error);
        // Check for unique constraint violation specifically
        if (error.code === 'P2002' && error.meta?.target?.includes('appointmentId')) {
             return res.status(409).json({ message: 'A review for this appointment already exists' });
        }
        res.status(500).json({ message: 'Could not submit review.' });
    }
});

export default router;