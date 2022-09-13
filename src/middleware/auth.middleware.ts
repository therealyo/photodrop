import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error';
import { TokenService } from '../service/token.service';

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const token = await TokenService.getBearerToken(authHeader);
        const userData = await TokenService.validateToken(token);

        req.body.user = userData;
        next();
    } catch (err) {
        next(err);
    }
}
