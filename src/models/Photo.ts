import { PhotoInterface } from '../@types/interfaces/PhotoInterface';
import crypto from 'crypto';
import { promisify } from 'util';
import { PhoneNumber } from './PhoneNumber';
import connection from '../connectors/sql.connector';
// import { Pool } from 'mysql2/promise';

const randomBytes = promisify(crypto.randomBytes);
export class Photo implements PhotoInterface {
    name?: string;
    albumId: number;
    userId?: number;
    numbers?: string[];

    constructor(albumId: number, numbers?: string[]) {
        this.albumId = albumId;
        this.numbers = numbers ? numbers : [];
    }

    async generateName(): Promise<void> {
        const rawBytes = await randomBytes(16);
        const photoName = rawBytes.toString('hex');
        this.name = photoName;
    }

    static async save(photos: Photo[]): Promise<void> {
        await Photo.savePhotos(photos);
        await Promise.all(
            photos.map((photo) => {
                photo.savePhotoNumbersRelation();
            })
        );
        // const insertValues = photos.map((photo) => {
        //     return [photo.name, photo.albumId];
        // });
        // await connection.query(
        //     'INSERT INTO photos (photoId, albumId) VALUES ?',
        //     [insertValues]
        // );
    }

    static async savePhotos(photos: Photo[]) {
        const insertValues = photos.map((photo) => {
            return [photo.name, photo.albumId];
        });
        await connection.query(
            'INSERT INTO photos (photoId, albumId) VALUES ?',
            [insertValues]
        );
    }

    private async getPhotoNumbersRelations(): Promise<(string | number)[][]> {
        const ids = [] as (number | undefined)[];
        for (const number of this.numbers!) {
            // const phoneNumber = new PhoneNumber(number);
            ids.push(await PhoneNumber.getId(number));
        }

        return ids.map((id) => {
            return [this.name!, id!];
        });
    }

    private async savePhotoNumbersRelation() {
        const photoToNumbersRelation = await this.getPhotoNumbersRelations();
        await connection.query(
            'INSERT INTO numbersOnPhotos (photoId, numberId) VALUES ?',
            [photoToNumbersRelation]
        );
    }

    // async save(): Promise<void> {
    //     await connection.query(
    //         'INSERT INTO photos (photoId, albumId) VALUES (?)',
    //         [[this.name, this.albumId]]
    //     );
    //     await this.saveNumbers();
    //     await this.savePhotoToNumbersRelations();
    // }

    // private async savePhotoToNumbersRelations(): Promise<void> {
    //     const photoToNumbersRelation = await this.getPhotoNumberRelations();
    //     await connection.query(
    //         'INSERT INTO numbersOnPhotos (photoId, numberId) VALUES ?',
    //         [photoToNumbersRelation]
    //     );
    // }

    // private async saveNumbers(): Promise<void> {
    //     for (const number of this.numbers!) {
    //         const phoneNumber = new PhoneNumber(number);
    //         try {
    //             await phoneNumber.save();
    //         } catch (err) {
    //             continue;
    //         }
    //     }
    // }

    static async getAlbumPhotos(albumId: number) {
        const query = (await connection.query(
            'SELECT photoId FROM photos WHERE albumId=?',
            [[albumId]]
        )) as any[];
        return query[0];
    }
}
