import { Response, Request, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import { verifyToken } from '../utils/genToken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
interface TokenPayLoad {
    userId: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let token;
        token = req.cookies.jwt;

        if (!token) {
            const authHeader = req.headers['authorization'];
            const bearerToken = authHeader && authHeader.split(' ')[1];

            if (bearerToken) {
                try {
                    const decoded = verifyToken(bearerToken) as TokenPayLoad;
                    req.userId = decoded.userId;
                    next();
                } catch (error) {
                    res.status(403).json({ message: 'Not authorized' });
                }
            } else {
                res.status(401).json({ message: 'No token provided' });
            }
        } else {
            try {
                const decoded = verifyToken(token) as TokenPayLoad;
                req.userId = decoded.userId;
                next();
            } catch (error) {
                res.status(403).json({ message: 'Not authorized' });
            }
        }
    }
);
