import { v4 as uuidv4 } from 'uuid';
import connection from '../connectors/sql.connector';
import { User } from './User';
import { ApiError } from '../errors/api.error';
import { PhotoId } from '../@types/PhotoId';
import { getQueryResult } from '../services/query.service';

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

    // static async getAlbumId(user: User, name: string): Promise<string> {
    //     try {
    //         const albumData = await Album.getAlbumData(user, name);
    //         return albumData.albumId!;
    //     } catch (err) {
    //         throw new ApiError(404, `Album ${name} does not exist`);
    //     }
    // }

    static async getAlbumData(albumId: string): Promise<Album> {
        const result = getQueryResult(await connection.query(`SELECT * FROM albums WHERE albumId=?`, [[albumId]]));
        return result[0];
    }

    static async getAlbumPhotos(albumId: string): Promise<PhotoId[]> {
        const result = getQueryResult(
            await connection.query('SELECT photoId, extension FROM photos WHERE albumId=?', [[albumId]])
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
