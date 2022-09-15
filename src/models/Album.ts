import connection from '../connectors/sql.connector';
import { AlbumInterface } from '../@types/interfaces/AlbumInterface';
import { User } from './User';

export class Album implements AlbumInterface {
    albumId?: number;
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
        await connection.query(
            'INSERT INTO albums (albumName, userId, location, created, path) VALUES (?);',
            [[this.albumName, this.userId, this.location, this.date, this.key]]
        );
        // await conn.end();
        return `Added ${this.albumName}`;
    }

    static async getAlbumId(
        albumName: string,
        userId: number
    ): Promise<number> {
        const albumData = (await this.getAlbumData(albumName, userId))[0];
        return albumData.albumId!;
    }

    static async getAlbumData(
        albumName: string,
        userId: number
    ): Promise<Album[]> {
        // const conn = await connect();
        const query = await connection.query(
            `SELECT * FROM albums WHERE albumName=? and userId=?`,
            [[albumName], [userId]]
        );
        return JSON.parse(JSON.stringify(query))[0];
    }

    static async delete(albumName: string, userId: number): Promise<string> {
        // const conn = await connect();
        await connection.query(
            'DELETE FROM albums WHERE albumName=? AND userId=?',
            [[albumName], [userId]]
        );
        return `Deleted ${albumName}`;
    }
}
