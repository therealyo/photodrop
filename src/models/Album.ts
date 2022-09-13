import { connect } from '../connectors/sql.connector';
import { AlbumInterface } from '../@types/interfaces/AlbumInterface';
import { User } from './User';

export class Album implements AlbumInterface {
    albumName: string;
    userId: number;
    location: string;
    date: string;
    key: string;

    constructor(albumName: string, user: User, location: string, date: string) {
        this.albumName = albumName;
        this.userId = user.userId!;
        this.location = location;
        this.date = date;
        this.key = `${user.login}/${albumName}/`;
    }

    async save(): Promise<string> {
        const conn = await connect();
        await conn.query(
            'INSERT INTO albums (albumName, userId, location, created, path) VALUES (?);',
            [[this.albumName, this.userId, this.location, this.date, this.key]]
        );
        return `Added ${this.albumName}`;
    }

    static async delete(albumName: string, userId: number): Promise<string> {
        const conn = await connect();
        await conn.query('DELETE FROM albums WHERE albumName=? AND userId=?', [
            [albumName],
            [userId]
        ]);
        return `Deleted ${albumName}`;
    }
}
