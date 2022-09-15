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

    async save(): Promise<void> {
        await connection.query(
            'INSERT INTO photos (photoId, albumId) VALUES (?)',
            [[this.name, this.albumId]]
        );
        await this.saveNumbers();
        await this.savePhotoToNumbersRelations();
        // await conn.end();
    }

    private async savePhotoToNumbersRelations(): Promise<void> {
        const photoToNumbersRelation = await this.getPhotoNumberRelations();
        await connection.query(
            'INSERT INTO numbersOnPhotos (photoId, numberId) VALUES ?',
            [photoToNumbersRelation]
        );
    }

    private async saveNumbers(): Promise<void> {
        for (const number of this.numbers!) {
            const phoneNumber = new PhoneNumber(number);
            if (!(await phoneNumber.exists())) {
                await phoneNumber.save();
            }
        }
    }

    private async getPhotoNumberRelations(): Promise<(string | number)[][]> {
        const ids = [] as (number | undefined)[];
        for (const number of this.numbers!) {
            const phoneNumber = new PhoneNumber(number);
            if (await phoneNumber.exists()) {
                ids.push(await phoneNumber.getId());
            }
        }

        return ids.map((id) => {
            return [this.name!, id!];
        });
    }

    async getPhotoData() {}
}
