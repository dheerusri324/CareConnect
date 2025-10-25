// backend/routes/auth.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'your-default-secret-key';

// --- Patient Registration ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password_hash: hashedPassword,
                role: 'patient',
            },
        });

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Internal server error during registration' });
    }
});

// --- General Login (Patient or Doctor) ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            // Include the doctor profile if it exists
            include: { doctorProfile: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // --- Prepare the response data ---
        const responseData = {
            token,
            role: user.role,
            username: user.username
        };

        // If the user is a doctor, add their actual name to the response
        if (user.role === 'doctor' && user.doctorProfile) {
            responseData.name = user.doctorProfile.name; // Add the doctor's name
        }
        // --- End of response data preparation ---

        res.json(responseData); // Send the combined data

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
});


export default router;

