import { User } from '../models/User';
import { verify, sign } from 'jsonwebtoken';
import { ApiError } from '../errors/api.error';
import { Client } from '../models/Client';
import { IUser } from '../@types/interfaces/IUser';
import { IClient } from '../@types/interfaces/IClient';

class TokenService {
    async generateToken(payload: User | Client): Promise<string> {
        if (payload instanceof User) {
            payload.password = 'undefined';
        }
        const accessToken = sign(payload, process.env.SECRET!, {
            expiresIn: '24h'
        });
        return `Bearer ${accessToken}`;
    }

    async validateToken(token: string): Promise<IUser | IClient | undefined> {
        try {
            const decoded = verify(token, process.env.SECRET!) as IUser & IClient;
            const { password, ...userData } = decoded;
            return userData;
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
