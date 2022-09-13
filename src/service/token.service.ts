import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/api.error';

export class TokenService {
    static async generateToken(payload: User): Promise<string> {
        const accessToken = jwt.sign(payload, process.env.SECRET!, {
            expiresIn: '24h'
        });
        return `Bearer ${accessToken}`;
    }
    static async validateToken(token: string): Promise<User> {
        try {
            const userData = jwt.verify(token, process.env.SECRET!) as User;
            return userData;
        } catch (err) {
            if (err.message === 'jwt expired') {
                throw ApiError.UnauthorizedError();
            }
            throw new ApiError(500, err.message, err);
        }
    }
    static async getBearerToken(authHeader: string): Promise<string> {
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw ApiError.UnauthorizedError();
        }
        return token;
    }
}
