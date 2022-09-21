import { PhotoInterface } from '../@types/interfaces/PhotoInterface';
import crypto from 'crypto';
import { promisify } from 'util';
import { PhoneNumber } from './PhoneNumber';
import connection from '../connectors/sql.connector';
import { PhotoId } from '../@types/PhotoId';

const randomBytes = promisify(crypto.randomBytes);
export class Photo implements PhotoInterface {
    name?: string;
    albumId?: number;
    userId?: number;
    numbers?: string[];

    constructor(albumId: number, numbers?: string[]) {
        this.albumId = albumId;
        this.numbers = numbers ? numbers : [];
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
        await connection.query('INSERT INTO photos (photoId, albumId) VALUES ?', [insertValues]);
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

    static async getAlbumPhotos(albumId: number): Promise<PhotoId[]> {
        const query = (await connection.query('SELECT photoId FROM photos WHERE albumId=?', [[albumId]])) as any[];
        return query[0];
    }
}
