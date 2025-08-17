import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface TokenPayLoad {
    userId: string;
}

export default function genToken(userId: string, res: Response) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret)
        throw new Error('JWT_SECRET is not defined in environment variables');
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '3d' });

    res.cookie('jwt', token, {
        httpOnly : true,
        secure: process.env.NODE_ENV !== "developments",
        sameSite: 'strict',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    })
};

export const verifyToken = (token: string): TokenPayLoad => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret)
        throw new Error('JWT_SECRET is not defined in environment variables');
    return jwt.verify(token, jwtSecret) as TokenPayLoad
}