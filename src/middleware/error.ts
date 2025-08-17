import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(err)
}

export const errorHandler = (err: any, req: Request, res: Response, next:NextFunction) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message

    if (err.name === 'CassError' && err.kind === 'ObjectId') {
        statusCode = 404
        message = "Resource not found"
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}