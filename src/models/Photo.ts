import { ApiError } from './../errors/api.error';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { PhoneNumber } from './PhoneNumber';
import connection from '../connectors/sql.connector';
import { Album } from './Album';
import { User } from './User';

const randomBytes = promisify(crypto.randomBytes);
export class Photo {
    name?: string;
    albumId?: number;
    userId?: number;
    numbers?: PhoneNumber[];
    extension?: string;
    fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async processFileName() {
        const split = this.fileName.split('/');
        console.log(split[3]);
        const userName = split[1].replace('%40', '@');
        const user = await User.getUserData(userName);
        if (split[0] === 'albums') {
            this.userId = user.userId;
            this.albumId = await Album.getAlbumId(user, split[2]);
            const [name, ext] = split[3].split('.');
            console.log(name);
            console.log(ext);
            this.name = name;
            this.extension = ext;
        } else if (split[0] === 'selfies') {
            this.userId = user.userId;
            this.name = split[2];
        } else {
            throw new ApiError(500, 'Something wrong with photo loading');
        }
    }

    async save() {
        await connection.query('INSERT INTO photos (photoId, albumId, extension) VALUES (?)', [
            [this.name, this.albumId, this.extension]
        ]);
    }

    async setName(): Promise<void> {
        this.name = await Photo.generateName();
    }

    static async generateName(): Promise<string> {
        const rawBytes = await randomBytes(16);
        const photoName = rawBytes.toString('hex');
        return photoName;
    }

    static async save(photos: string[], numbers: string[]): Promise<void> {
        // await Photo.savePhotos(albumId, photos);
        await Photo.savePhotoNumbersRelation(photos, numbers);
    }

    static async savePhotos(albumId: number, photos: string[]): Promise<void> {
        const insertValues = photos.map((photo) => {
            return [photo, albumId];
        });
        try {
            await connection.query('INSERT INTO photos (photoId, albumId) VALUES ?;', [insertValues]);
        } catch (err) {
            console.log(err);
        }
    }

    static async savePhotoNumbersRelation(photos: string[], numbers: string[]) {
        const relations = (
            await Promise.all(
                photos.map(async (photo) => {
                    return await Photo.createPhotoNumbersRelations(photo, numbers);
                })
            )
        ).flat();
        console.log(relations);

        try {
            await connection.query('INSERT INTO numbersOnPhotos (photoId, numberId) VALUES ?;', [relations]);
        } catch (err) {
            console.log(err);
        }
    }

    static async createPhotoNumbersRelations(photo: string, numbers: string[]): Promise<(string | number)[][]> {
        return await Promise.all(
            numbers.map(async (number) => {
                return [photo, await PhoneNumber.getId(number)];
            })
        );
    }
}
