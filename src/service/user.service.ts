import { compare, hash } from 'bcrypt';
import { ApiError } from '../errors/api.error';
import { User } from '../models/User';
import tokenService from './token.service';
import { Client } from '../models/Client';
import phoneNumberService from './phoneNumber.service';
import { ClientData } from '../@types/ClientData';

class UserService {
    async registration(login: string, password: string, email?: string, fullName?: string): Promise<string> {
        const hashedPassword = await hash(password, 3);
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
        const userData = (await User.getUserData(login))[0];
        const isPassValid = await compare(password, userData.password);

        if (!isPassValid) {
            throw ApiError.WrongCredentials();
        }

        const token = tokenService.generateToken(userData);
        return token;
    }

    async searchClient(user: User, contains: string): Promise<ClientData | undefined> {
        const foundClient = await User.searchClient(user, contains);
        if (foundClient) {
            const { number: clientNumber } = foundClient;
            const clientData = await Client.getData(clientNumber);
            return {
                number: phoneNumberService.splitNumber(clientNumber),
                name: clientData?.name
            };
        }
    }
}

export default new UserService();
