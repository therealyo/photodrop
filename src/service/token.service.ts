import { User } from '../models/User';
import jwt from 'jsonwebtoken';

export class TokenService {
    static async generateToken(payload: User) {
        const accessToken = jwt.sign(payload, process.env.SECRET!, {
            expiresIn: '24h'
        });
        return accessToken;
    }
    static async validateToken() {}
}
