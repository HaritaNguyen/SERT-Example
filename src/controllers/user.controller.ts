import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import bcrypt from 'bcrypt';

import { db } from '../lib/prisma';
import generateUniqueUsername from '../utils/defaultUsername';
import genToken from '../utils/genToken';

// POST /api/v1/auth
const authUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400)
        throw new Error("Email and password are required")
    }
    
    try {
        const user = await db.user.findUnique({
            where: { email }
        })

        if (!user) {
            res.status(401).json({ msg: "Invaild credentials" })
            return
        }

        const isPasswordVaild = await bcrypt.compare(password, user.password)

        if (!isPasswordVaild) {
            res.status(401).json({ msg: "Invaild credentials"})
            return
        }

        genToken(user.id, res);

        res.status(200).json({ msg: "Login successful!"})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during login.'})
    }
});

// POST /api/v1/
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await db.user.findUnique({
        where: { email },
    });

    if (userExists) {
        res.status(400);
        throw new Error('User already exist!');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                username: await generateUniqueUsername()
            },
        });

        if (newUser.username) {
            res.status
        }

        res.status(200).json({
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
        });
    } catch (error) {
        console.error(error);
    }
});

// POST /api/v1/logout
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date()
    })

    res.status(200).json({ msg: "User Logout" })
});

// GET /api/v1/profile
// Private
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params

    try {
        const profile = await db.user.findUnique({
            where: { username: username },
            select: {
                name: true,
                username: true
            }
        })

        if (!profile) {
            res.status(404)
            throw new Error("Profile not found")
        }
        res.json(profile)
    } catch (error) {
        res.status(500).json({ err : "Internal server error "})
    }
})
export { authUser, registerUser, logoutUser, getUserProfile };
