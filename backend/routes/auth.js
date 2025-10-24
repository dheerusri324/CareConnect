// backend/routes/auth.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'your-default-secret-key'; // Ensure SECRET_KEY is in your .env

// --- Patient Registration ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

        // Create new user (default role is 'patient')
        const newUser = await prisma.user.create({
            data: {
                username,
                password_hash: hashedPassword,
                role: 'patient', // Explicitly set role
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
        });

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Payload
            SECRET_KEY,                       // Secret Key
            { expiresIn: '24h' }              // Token expiry time
        );

        res.json({ token, role: user.role, username: user.username });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
});


export default router; // Export the router
