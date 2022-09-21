import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            errors: err.errors
        });
    }
    console.log(err);
    return res.status(500).json({ status: 500, message: err.message });
}
