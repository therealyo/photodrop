import connection from '../connectors/sql.connector';
import { User } from './User';
import { ApiError } from '../errors/api.error';
import { PhotoId } from '../@types/PhotoId';
import { getQueryResult } from '../services/query.service';

export class Album {
    albumId?: number;
    name: string;
    userId: number;
    location: string;
    date: string | Date;
    path: string;
    photos?: { url: string; watermark: boolean }[];

    constructor(name: string, user: User, location: string, date: string | undefined) {
        this.name = name;
        this.userId = user.userId!;
        this.location = location;
        this.date = new Date(date).toString() !== 'Invalid Date' ? new Date(date) : new Date();
        this.path = `albums/${user.email}/${name}/`;
    }

    async save(): Promise<void> {
        try {
            await connection.query('INSERT INTO albums (name, userId, location, date, path) VALUES (?);', [
                [this.name, this.userId, this.location, this.date, this.path]
            ]);
        } catch (err) {
            throw new ApiError(400, `Album ${this.name} already exists`);
        }
    }

    static async getAlbumId(user: User, name: string): Promise<number> {
        try {
            const albumData = await Album.getAlbumData(user, name);
            return albumData.albumId!;
        } catch (err) {
            throw new ApiError(404, `Album ${name} does not exist`);
        }
    }

    static async getAlbumData(user: User, name: string): Promise<Album> {
        console.log('User: ', user);
        console.log('Album name: ', name);
        const result = getQueryResult(
            await connection.query(`SELECT * FROM albums WHERE name=? AND userId=?`, [[name], [user.userId!]])
        );
        return result[0];
    }

    static async getAlbumPhotos(albumId: number): Promise<PhotoId[]> {
        const result = getQueryResult(
            await connection.query('SELECT photoId, waterMark FROM photos WHERE albumId=?', [[albumId]])
        );
        return result;
    }

    static async countPhotos(album: Album): Promise<number> {
        const photos = await Album.getAlbumPhotos(album.albumId!);
        return photos.length;
    }

    static async delete(name: string, userId: number): Promise<string> {
        await connection.query('DELETE FROM albums WHERE name=? AND userId=?', [[name], [userId]]);
        return `Deleted ${name}`;
    }
}
