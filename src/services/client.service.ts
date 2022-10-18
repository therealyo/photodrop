import otpService from './otp.service';
import tokenService from './token.service';
import presignedUrlService from './presignedUrl.service';
import { ApiError } from './../errors/api.error';
import { Client } from '../models/Client';
import { Photo } from '../models/Photo';
import { PresignedUrl } from '../@types/PresignedUrl';
import { ClientData } from '../@types/ClientData';
import { Album } from '../models/Album';

class ClientService {
    async createClient(number: string, newNumber?: string): Promise<string> {
        const otp = await otpService.sendOtp(number);

        const client = await Client.getData(number);

        if (client) {
            await Client.updateOtp(client, otp);
            if (newNumber) await Client.setNewNumber(client, newNumber);
        } else {
            if (newNumber) throw ApiError.BadRequest('User does not exist');
            else {
                const newClient = new Client(number);
                await newClient.save();
                await Client.updateOtp(newClient, otp);
            }
        }

        return client.number;
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

    async getClient(client: Client): Promise<ClientData> {
        const userData = await Client.getData(client.number);
        return {
            number: userData!.number,
            email: userData!.email,
            name: userData!.name,
            selfie: `${process.env.BUCKET_PATH}selfies/${userData!.clientId}/${userData!.selfieLink}`
        };
    }

    async setSelfie(client: Client): Promise<PresignedUrl> {
        const selfieName = await Photo.generateName();
        const link = await presignedUrlService.getPresignedUrl(`selfies/${client.clientId}/${selfieName}`);
        return link;
    }

    async setPersonalData(client: Client, name: string | undefined, email: string | undefined): Promise<string> {
        await Client.setPersonalData(client, name, email);
        return 'profile changed';
    }

    async getClientAlbums(client: Client) {
        const purchasedAlbums = await Client.getPurchasedAlbums(client);

        return await Promise.all(
            (
                await Client.getAlbums(client)
            ).map(async (albumId) => {
                const purchased = purchasedAlbums.includes(albumId);
                return { purchased, ...(await Album.getAlbumData(albumId)) };
            })
        );
    }

    async getClientAlbumData(client: Client, albumId: string) {
        return await Client.getClientAlbumPhotos(client, albumId);
    }
}

export default new ClientService();
