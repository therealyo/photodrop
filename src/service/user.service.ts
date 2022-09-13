import { compare, hash } from 'bcrypt';
import { ApiError } from '../errors/api.error';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { TokenService } from './token.service';

export class UserService {
    static async registration(
        login: string,
        password: string,
        email?: string,
        fullName?: string
    ) {
        const hashedPassword = await hash(password, 3);
        const user = new User(login, hashedPassword, email, fullName);

        if (!(await User.exists(login))) {
            return await user.save();
        } else {
            throw ApiError.BadRequest(`User ${login} already exists`);
        }
    }
    static async login(login: string, password: string) {
        if (!(await User.exists(login))) {
            throw ApiError.BadRequest(`Wrong login or password`);
        }
        const userData = (await User.getUserData(login))[0];
        const isPassValid = await compare(password, userData.password);

        if (!isPassValid) {
            throw ApiError.BadRequest(`Wrong login or password`);
        }

        const token = TokenService.generateToken(userData);
        return token;
    }
    static async getAlbums() {}
}
