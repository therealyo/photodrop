import { ApiError } from './../errors/api.error';
import { v4 as uuidv4 } from 'uuid';

import connection from '../connectors/sql.connector';
import { Otp } from '../@types/Otp';
import { Photo } from './Photo';
import { getQueryResult } from '../services/query.service';
import { IClient } from '../@types/interfaces/IClient';
import { Album } from './Album';

export class Client implements IClient {
    clientId?: string;
    number: string;
    selfieLink?: string;
    name?: string;
    email?: string;
    token: string;
    expires: Date;

    constructor(number: string) {
        this.clientId = uuidv4();
        this.number = number;
        // this.token = otp.token;
        // this.expires = otp.expires;
    }

    // async setFolder(): Promise<void> {
    //     this.selfieFolder = await Photo.generateName();
    // }

    async save(): Promise<void> {
        await connection.query(
            'INSERT IGNORE INTO clients (clientId, number, name, email, selfieLink, token, expires) VALUES (?)',
            [[this.clientId, this.number, this.name, this.email, this.selfieLink, this.token, this.expires]]
        );
    }

    // static async getClientData(number: string) {
    //     return getQueryResult(await connection.query('SELECT * FROM clients WHERE number=?', [[number]]))[0];
    // }

    static async updateOtp(client: Client, otp: Otp): Promise<void> {
        await connection.query('UPDATE clients SET token=?, expires=? WHERE clientId=?', [
            [otp.token],
            [otp.expires],
            [client.clientId]
        ]);
    }

    static async setNewNumber(client: Client, number: string): Promise<void> {
        await connection.query('UPDATE clients SET newNumber=? WHERE clientId=?', [[number], [client.clientId]]);
    }

    static async verifyChangeNumber(client: Client, number: string): Promise<boolean> {
        const result = getQueryResult(
            await connection.query('SELECT newNumber FROM clients WHERE clientId=?', [[client.clientId]])
        );
        const newNumber = result[0].newNumber;
        return number === newNumber;
    }

    static async changeNumber(client: Client, number: string): Promise<void> {
        await connection.query('UPDATE clients SET number=?, newNumber="undefined" WHERE clientId=?', [
            [number],
            client.clientId
        ]);
    }

    static async getData(number: string): Promise<Client | undefined> {
        const result = getQueryResult(await connection.query('SELECT * FROM clients WHERE number=?', [[number]]));
        return result[0];
    }

    static async setSelfie(client: Client, link: string): Promise<void> {
        await connection.query('UPDATE clients SET selfieLink=? WHERE clientId=?', [[link], [client.clientId]]);
    }

    static async setPersonalData(client: Client, name: string | undefined, email: string | undefined) {
        await connection.query('UPDATE clients SET name=?, email=? WHERE clientId=?', [
            [name],
            [email],
            [client.clientId]
        ]);
    }

    static async getAlbums(client: Client): Promise<string[]> {
        const clientAlbumsIds = getQueryResult(
            await connection.query('SELECT DISTINCT albumId FROM numbersOnPhotos WHERE clientId;', [client.clientId])
        );
        return clientAlbumsIds.map(({ albumId }) => {
            return albumId;
        });
    }

    static async getClientAlbumPhotos(client: Client, albumId: string) {
        const albums = await Client.getAlbums(client);
        if (albums.includes(albumId)) {
            const albumData = await Album.getAlbumData(albumId);
            const clientPhotos = getQueryResult(
                await connection.query(
                    `WITH clientsPhotos AS (SELECT * FROM numbersOnPhotos WHERE clientId="${client.clientId}" AND albumId="${albumId}") SELECT * FROM photos LEFT JOIN clientsPhotos ON photos.photoId=clientsPhotos.photoId;`
                )
            ).map((photo: Photo) => {
                return `${process.env.BUCKET_PATH}${albumData.path}${photo.photoId}.${photo.extension}`;
            });

            return {
                ...albumData,
                photos: clientPhotos
            };
        } else {
            throw new ApiError(404, 'Album does not exist');
        }
    }

    static async getPurchasedAlbums(client: Client) {
        const res = getQueryResult(
            await connection.query('SELECT * FROM clientsAlbums WHERE clientId=?', [[client.clientId]])
        )[0];
        // console.log(res);

        return res ? res : [];
    }
}
