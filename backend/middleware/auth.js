import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY || 'your-default-secret-key';

export const tokenRequired = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        req.user = user; // Attach user to the request object
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next(); // Proceed to the next middleware or route handler
};