import { compare, hash } from 'bcryptjs';

import { ApiError } from '../errors/api.error';
import { User } from '../models/User';
import tokenService from './token.service';
import { Client } from '../models/Client';
import phoneNumberService from './phoneNumber.service';
import { ClientData } from '../@types/ClientData';
import { Album } from '../models/Album';
// import { hashPassword, comparePassword } from '../libs/hashing';

class UserService {
    async registration(login: string, password: string, email?: string, fullName?: string): Promise<string> {
        const hashedPassword = await hash(password, 10);
        const user = new User(login, hashedPassword, email, fullName);

        if (!(await User.exists(login))) {
            return await user.save();
        } else {
            throw ApiError.BadRequest(`User ${login} already exists`);
        }
    }

    async login(login: string, password: string): Promise<string> {
        if (!(await User.exists(login))) {
            throw ApiError.WrongCredentials();
        }
        const userData = await User.getUserData(login);
        const isPassValid = await compare(password, userData.password);
        if (!isPassValid) {
            throw ApiError.WrongCredentials();
        }

        const token = tokenService.generateToken(userData);
        return token;
    }

    async getAlbums(user: User): Promise<Album[]> {
        return await User.getUserAlbums(user);
    }

    async searchClient(user: User, contains: string): Promise<ClientData | undefined> {
        // TODO: change implementation to suggest clients while input, not after full number has been entered
        const foundClient = await User.searchClient(user, contains);
        if (foundClient) {
            const { number: clientNumber } = foundClient;
            const clientData = await Client.getData(clientNumber);
            return {
                number: phoneNumberService.splitNumber(clientNumber!),
                name: clientData?.name
            };
        }
    }
}

export default new UserService();
