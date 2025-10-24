// backend/prisma/seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctorsToCreate = [
        {
            user: {
                username: 'dr_smith',
                password_hash: hashedPassword,
                role: 'doctor',
            },
            profile: {
                name: 'Dr. John Smith',
                specialization: 'Cardiology',
            }
        },
        {
            user: {
                username: 'dr_jones',
                password_hash: hashedPassword,
                role: 'doctor',
            },
            profile: {
                name: 'Dr. Sarah Jones',
                specialization: 'Dermatology',
            }
        },
        {
            user: {
                username: 'dr_williams',
                password_hash: hashedPassword,
                role: 'doctor',
            },
            profile: {
                name: 'Dr. David Williams',
                specialization: 'Pediatrics',
            }
        },
        {
            user: {
                username: 'dr_123',
                password_hash: hashedPassword,
                role: 'doctor',
            },
            profile: {
                name: 'Dr. Dheeraj',
                specialization: 'Neurologist',
            }
        },
    ];

    for (const docData of doctorsToCreate) {
        const doctor = await prisma.user.create({
            data: {
                ...docData.user,
                doctorProfile: {
                    create: docData.profile,
                },
            },
        });
        console.log(`Created doctor: ${doctor.username}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });