import { compare, hash } from 'bcryptjs';

import { ApiError } from '../errors/api.error';
import { User } from '../models/User';
import tokenService from './token.service';
import { Album } from '../models/Album';

class UserService {
    async registration(login: string, password: string, email?: string, fullName?: string): Promise<string> {
        const hashedPassword = await hash(password, 10);
        const user = new User(login, hashedPassword, email, fullName);

        if (!(await User.exists(email))) {
            return await user.save();
        } else {
            throw ApiError.BadRequest(`User ${email} already exists`);
        }
    }

    async login(email: string, password: string): Promise<string> {
        if (!(await User.exists(email))) {
            throw ApiError.WrongCredentials();
        }
        const userData = await User.getUserData(email);
        const isPassValid = await compare(password, userData.password);
        if (!isPassValid) {
            throw ApiError.WrongCredentials();
        }

        const token = await tokenService.generateToken(userData);
        return token;
    }

    async getAlbums(user: User): Promise<Album[]> {
        return await User.getUserAlbums(user);
    }
}

export default new UserService();
