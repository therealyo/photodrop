import { v4 as uuidv4 } from 'uuid';
import connection from '../connectors/sql.connector';
import { User } from './User';
import { ApiError } from '../errors/api.error';

export class Album {
    albumId?: string;
    name: string;
    userId: string;
    location: string;
    date: string | Date;
    path: string;
    photos?: { url: string; watermark: boolean }[];

    constructor(name: string, user: User, location: string, date: string | undefined) {
        this.albumId = uuidv4();
        this.name = name;
        this.userId = user.userId!;
        this.location = location;
        this.date = new Date(date).toString() !== 'Invalid Date' ? new Date(date) : new Date();
        this.path = `albums/${user.email}/${this.albumId}/`;
    }

    async save(): Promise<Album> {
        try {
            await connection.query('INSERT INTO albums (albumId, name, userId, location, date, path) VALUES (?);', [
                [this.albumId, this.name, this.userId, this.location, this.date, this.path]
            ]);
            return this;
        } catch (err) {
            throw new ApiError(500, `Album ${this.albumId} already exists`);
        }
    }
}
