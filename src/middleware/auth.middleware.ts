import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error';
import tokenService from '../service/token.service';

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const token = await tokenService.getBearerToken(authHeader);
        const userData = await tokenService.validateToken(token);

        req.body.user = userData;
        next();
    } catch (err) {
        next(err);
    }
}
