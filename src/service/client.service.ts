import { Client } from '../models/Client';
import otpService from './otp.service';

class ClientService {
    async createClient(number: string, newNumber?: string): Promise<string> {
        const otp = await otpService.sendOtp(number);
        const client = new Client(number, otp);

        if (newNumber) {
            await client.updateNumber(newNumber);
        } else {
            if (!(await Client.getData(number))) {
                await client.save();
            } else {
                await client.updateOtp();
            }
        }

        return 'Verification code sent';
    }

    async verifyClient(number: string, code: string, newNumber?: string) {
        const accessToken = await otpService.verifyOtp(number, code);
        return accessToken;
    }

    async getClient(client: Client) {
        const userData = await Client.getData(client.number);
        return {
            number: userData!.number,
            email: userData!.email,
            name: userData!.name,
            selfie: userData!.selfieLink
        };
    }

    async setSelfie() {}
}

export default new ClientService();
