// backend/routes/patient.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { tokenRequired } from '../middleware/auth.js';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();
const router = express.Router();

// --- ADD THIS NEW ROUTE ---
// GET /api/doctors/profiles
router.get('/doctors/profiles', tokenRequired, async (req, res) => {
    try {
        // Fetch all doctors and include their reviews
        const doctorsWithReviews = await prisma.doctor.findMany({
            include: {
                reviews: {
                    select: {
                        rating: true,
                    }
                }
            }
        });

        // Calculate average rating and review count for each doctor
        const profiles = doctorsWithReviews.map(doctor => {
            const reviewCount = doctor.reviews.length;
            const avgRating = reviewCount > 0
                ? doctor.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
                : 0;

            return {
                id: doctor.id,
                name: doctor.name,
                specialization: doctor.specialization,
                profile_pic: doctor.profile_pic,
                average_rating: avgRating,
                review_count: reviewCount
            };
        });

        res.json(profiles);
    } catch (error) {
        console.error("Error fetching doctor profiles:", error);
        res.status(500).json({ message: "Failed to fetch doctor profiles" });
    }
});
// --- END OF NEW ROUTE ---


// GET /api/doctors
router.get('/doctors', tokenRequired, async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany();
        res.json({ doctors });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch doctors' });
    }
});

// GET /api/my-appointments
router.get('/my-appointments', tokenRequired, async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where: { patientId: req.user.id },
            include: { doctor: true, review: true },
            orderBy: [{ appointment_date: 'desc' }, { appointment_time: 'desc' }],
        });

        const now = DateTime.now();
        const output = appointments.map(appt => {
            const apptDateTime = DateTime.fromISO(appt.appointment_date.toISOString().split('T')[0] + 'T' + appt.appointment_time);
            let status = appt.status;
            if (apptDateTime < now) {
                status = "Completed";
            }
            return {
                id: appt.id,
                doctor_name: appt.doctor.name,
                specialization: appt.doctor.specialization,
                date: DateTime.fromJSDate(appt.appointment_date).toISODate(),
                time: appt.appointment_time,
                status: status,
                has_review: !!appt.review,
            };
        });
        res.json({ appointments: output });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
});

// GET /api/doctors/:doctorId/available-slots
router.get('/doctors/:doctorId/available-slots', tokenRequired, async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
    }
    try {
        const selectedDate = DateTime.fromISO(date).toJSDate();
        const now = DateTime.now();
        const bookedAppointments = await prisma.appointment.findMany({
            where: {
                doctorId: parseInt(doctorId),
                appointment_date: selectedDate,
            },
            select: { appointment_time: true }
        });
        const bookedTimes = new Set(bookedAppointments.map(a => a.appointment_time));
        const allSlots = [];
        let currentTime = DateTime.fromISO(date).set({ hour: 9, minute: 0 });
        const endTime = DateTime.fromISO(date).set({ hour: 17, minute: 0 });
        while (currentTime < endTime) {
            const timeStr = currentTime.toFormat('HH:mm');
            const isToday = now.toISODate() === date;
            const isPast = isToday && now > currentTime;
            allSlots.push({
                time: timeStr,
                booked: bookedTimes.has(timeStr) || isPast,
            });
            currentTime = currentTime.plus({ minutes: 15 });
        }
        res.json(allSlots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ message: "Failed to fetch slots" });
    }
});

// POST /api/appointments
router.post('/appointments', tokenRequired, async (req, res) => {
    const { doctor_id, date, time } = req.body;
    const patientId = req.user.id;
    
    try {
        const appointmentDate = new Date(date);

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: parseInt(doctor_id),
                appointment_date: appointmentDate,
                appointment_time: time,
            }
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'This time slot was just booked. Please select another time.' });
        }

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: patientId,
                doctorId: parseInt(doctor_id),
                appointment_date: appointmentDate,
                appointment_time: time,
            }
        });

        res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Could not book appointment." });
    }
});

// GET /api/doctors/:id
router.get('/doctors/:id', tokenRequired, async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: parseInt(id) },
            include: {
                reviews: {
                    include: {
                        author: {
                            select: { username: true } // Include author's username
                        }
                    },
                    orderBy: { created_at: 'desc' } // Order reviews by newest first
                }
            }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const reviewCount = doctor.reviews.length;
        const averageRating = reviewCount > 0
            ? doctor.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
            : 0;

        res.json({
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
            profile_pic: doctor.profile_pic,
            average_rating: averageRating,
            review_count: reviewCount,
            reviews: doctor.reviews.map(review => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
                patient_username: review.author.username
            }))
        });

    } catch (error) {
        console.error("Error fetching single doctor profile:", error);
        res.status(500).json({ message: "Failed to fetch doctor profile" });
    }
});


export default router;