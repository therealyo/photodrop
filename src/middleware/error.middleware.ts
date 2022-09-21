import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            errors: err.errors
        });
    }
    return res.status(500).json({ status: 500, message: err.message });
}
