import { User } from '../models/User';
import { verify, sign } from 'jsonwebtoken';
import { ApiError } from '../errors/api.error';
import { Client } from '../models/Client';
import { IUser } from '../@types/interfaces/IUser';

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

    async validateToken(token: string): Promise<IUser | undefined> {
        try {
            const userData = verify(token, process.env.SECRET!) as User;
            if (await User.exists(userData.login)) {
                return {
                    userId: userData.userId,
                    login: userData.login,
                    email: userData.email,
                    fullName: userData.fullName
                };
            } else {
                throw ApiError.UnauthorizedError();
            }
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
