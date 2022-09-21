import { ApiError } from './../errors/api.error';
import { Client } from '../models/Client';
import otpService from './otp.service';
import tokenService from './token.service';
import phoneService from './phoneNumber.service';
import { getPresignedUrl } from './presignedUrl.service';
import { Photo } from '../models/Photo';
import photoService from './photo.service';

class ClientService {
    async createClient(number: string, newNumber?: string): Promise<string> {
        const otp = await otpService.sendOtp(number);
        const client = new Client(number, otp);

        if (await Client.getData(number)) {
            await client.updateOtp();
            if (newNumber) await client.setNewNumber(newNumber);
        } else {
            if (newNumber) throw ApiError.BadRequest('User does not exist');
            else {
                await client.setFolder();
                await client.save();
            }
        }

        return 'Verification code sent';
    }

    async verifyClient(number: string, code: string, newNumber?: string): Promise<string | undefined> {
        const verified = await otpService.verifyOtp(number, code);
        if (verified) {
            const client = await Client.getData(number);
            if (newNumber) {
                if (await Client.getData(newNumber)) {
                    throw ApiError.BadRequest('Cannot change number. User with such number already exists');
                }
                if (await Client.verifyChangeNumber(client!, newNumber)) {
                    await Client.changeNumber(client!, newNumber);
                    return 'Number changed';
                } else {
                    throw ApiError.BadRequest('New number not verified');
                }
            } else {
                return await tokenService.generateToken(client!);
            }
        }
    }

    async getClient(client: Client) {
        const userData = await Client.getData(client.number);
        return {
            number: phoneService.splitNumber(userData!.number),
            email: userData!.email,
            name: userData!.name,
            selfie: `${process.env.BUCKET_PATH}${userData!.selfieFolder}/${userData!.selfieLink}.jpg`
        };
    }

    async setSelfie(client: Client) {
        const selfieName = await Photo.generateName();
        const params = photoService.getParams(`selfies/${client.selfieFolder}/${selfieName}.jpg`);
        const link = await getPresignedUrl('putObject', params);
        await Client.setSelfie(client, selfieName);
        return link;
    }
}

export default new ClientService();
