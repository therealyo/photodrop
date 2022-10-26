import { compare, hash } from 'bcryptjs';

import { ApiError } from '../errors/api.error';
import { User } from '../models/User';
import tokenService from './token.service';
import { Album } from '../models/Album';
import { getQueryResult } from '../libs/queryResult';
import connection from '../connectors/sql.connector';

class UserService {
    async registration(login: string, password: string, email?: string, fullName?: string): Promise<string> {
        const hashedPassword = await hash(password, 10);
        const user = new User(login, hashedPassword, email, fullName);

        if (!(await this.exists(email))) {
            return await user.save();
        } else {
            throw ApiError.BadRequest(`User ${email} already exists`);
        }
    }

    async login(email: string, password: string): Promise<string> {
        if (!(await this.exists(email))) {
            throw ApiError.WrongCredentials();
        }
        const userData = await this.getUserData(email);
        const isPassValid = await compare(password, userData.password);
        if (!isPassValid) {
            throw ApiError.WrongCredentials();
        }

        const token = await tokenService.generateToken(userData);
        return token;
    }

    async getAlbums(user: User): Promise<Album[]> {
        return await this.getUserAlbums(user);
    }

    async getUserData(id: number): Promise<User>;
    async getUserData(email: string): Promise<User>;
    async getUserData(arg: string | number): Promise<User> {
        const param = typeof arg === 'string' ? 'email' : 'userId';
        const result = getQueryResult(
            await connection.query(`SELECT userId, login, password, email, fullName FROM users WHERE ${param}=?`, [arg])
        );
        return result[0];
    }

    async exists(login: string): Promise<boolean> {
        const entries = await this.getUserData(login);
        return entries ? true : false;
    }

    async getUserAlbums(user: User): Promise<Album[]> {
        const result = getQueryResult(
            await connection.query('SELECT albumId, name, location, date FROM albums WHERE userId=?', [[user.userId!]])
        );
        return result;
    }
}

export default new UserService();
