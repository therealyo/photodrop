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
    fileName: string;

    // TODO: make watermarks true all the time

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async processFileName() {
        const split = this.fileName.split('/');
        console.log('split: ', split);
        const userName = split[1].replace('%40', '@');
        const user = await User.getUserData(userName);
        console.log(user);
        if (split[0] === 'albums') {
            this.userId = user.userId;
            this.albumId = await Album.getAlbumId(user, split[2]);
            console.log(this.albumId);
            this.name = split[3];
        } else if (split[0] === 'selfies') {
            this.userId = user.userId;
            this.name = split[2];
        } else {
            throw new ApiError(500, 'Something wrong with photo loading');
        }
    }

    async save() {
        await connection.query('INSERT INTO photos (photoId, albumId) VALUES (?)', [[this.name, this.albumId]]);
    }

    async setName(): Promise<void> {
        const name = await Photo.generateName();
        this.name = name;
    }

    static async generateName(): Promise<string> {
        const rawBytes = await randomBytes(16);
        const photoName = rawBytes.toString('hex');
        return photoName;
    }

    static async save(photos: Photo[]): Promise<void> {
        await Photo.savePhotos(photos);
        await Promise.all(
            photos.map((photo) => {
                photo.savePhotoNumbersRelation();
            })
        );
    }

    static async savePhotos(photos: Photo[]): Promise<void> {
        const insertValues = photos.map((photo) => {
            return [photo.name, photo.albumId];
        });
        await connection.query('INSERT INTO photos (photoId, albumId, waterMark) VALUES ?', [insertValues]);
    }

    static async removeWatermark(photoName: string) {
        await connection.query('UPDATE photos SET waterMark=? WHERE photoId=?', [[0], [photoName]]);
    }

    private async getPhotoNumbersRelations(): Promise<(string | number)[][]> {
        const ids = [] as (number | undefined)[];
        for (const number of this.numbers!) {
            ids.push(await PhoneNumber.getId(number));
        }

        return ids.map((id) => {
            return [this.name!, id!];
        });
    }

    private async savePhotoNumbersRelation(): Promise<void> {
        const photoToNumbersRelation = await this.getPhotoNumbersRelations();
        await connection.query('INSERT INTO numbersOnPhotos (photoId, numberId) VALUES ?', [photoToNumbersRelation]);
    }
}
