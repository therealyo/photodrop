import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/api.error';
import { Client } from '../models/Client';

class TokenService {
    async generateToken(payload: User | Client): Promise<string> {
        const accessToken = jwt.sign(payload, process.env.SECRET!, {
            expiresIn: '24h'
        });
        return `Bearer ${accessToken}`;
    }
    async validateToken(token: string): Promise<User | undefined> {
        try {
            const userData = jwt.verify(token, process.env.SECRET!) as User;
            if (await User.exists(userData.login)) return userData;
            else throw ApiError.UnauthorizedError();
        } catch (err) {
            throw ApiError.UnauthorizedError();
        }
    }
    async getBearerToken(authHeader: string): Promise<string> {
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw ApiError.UnauthorizedError();
        }
        return token;
    }
}

export default new TokenService();
