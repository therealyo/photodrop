import { IPhoto } from '../@types/interfaces/IPhoto';
import crypto from 'crypto';
import { promisify } from 'util';
import { PhoneNumber } from './PhoneNumber';
import connection from '../connectors/sql.connector';
import { PhotoId } from '../@types/PhotoId';

const randomBytes = promisify(crypto.randomBytes);
export class Photo implements IPhoto {
    name?: string;
    albumId?: number;
    userId?: number;
    numbers?: string[];
    waterMark: boolean;

    constructor(albumId: number, waterMarkStatus: boolean, numbers?: string[]) {
        this.albumId = albumId;
        this.numbers = numbers ? numbers : [];
        this.waterMark = waterMarkStatus;
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
            return [photo.name, photo.albumId, photo.waterMark];
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
