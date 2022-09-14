import { PhotoInterface } from '../@types/interfaces/PhotoInterface';
import crypto from 'crypto';
import { promisify } from 'util';
import { PhoneNumber } from './PhoneNumber';
import { connect } from '../connectors/sql.connector';

const randomBytes = promisify(crypto.randomBytes);
export class Photo implements PhotoInterface {
    name?: string;
    albumId: number;
    link?: string;
    numbers?: string[];

    constructor(albumId: number, numbers?: string[]) {
        this.albumId = albumId;
        this.numbers = numbers ? numbers : [];
    }

    async setLink(link: string): Promise<void> {
        this.link = link;
    }

    async generateName(): Promise<void> {
        const rawBytes = await randomBytes(16);
        const photoName = rawBytes.toString('hex');
        this.name = photoName;
    }

    async save(): Promise<void> {
        const conn = await connect();
        await conn.query(
            'INSERT INTO photos (photoId, albumId, link) VALUES (?)',
            [[this.name, this.albumId, this.link]]
        );
        await this.saveNumbers();
    }

    async saveNumbers(): Promise<void> {
        for (const number of this.numbers!) {
            await new PhoneNumber(number).save();
        }
    }

    async getPhotoData() {}
}
