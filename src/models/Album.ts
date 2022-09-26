import connection from '../connectors/sql.connector';
import { AlbumInterface } from '../@types/interfaces/AlbumInterface';
import { User } from './User';
import { ApiError } from '../errors/api.error';
import { PhotoId } from '../@types/PhotoId';

export class Album implements AlbumInterface {
    albumId?: number;
    albumName: string;
    userId: number;
    location: string;
    date: string | Date;
    path: string;
    photos?: { url: string; watermark: boolean }[];

    constructor(albumName: string, user: User, location: string, date: string | undefined) {
        this.albumName = albumName;
        this.userId = user.userId!;
        this.location = location;
        this.date = date ? date : new Date();
        this.path = `albums/${user.login}/${albumName}/`;
    }

    async save(): Promise<void> {
        try {
            await connection.query('INSERT INTO albums (albumName, userId, location, date, path) VALUES (?);', [
                [this.albumName, this.userId, this.location, this.date, this.path]
            ]);
        } catch (err) {
            throw new ApiError(400, `Album ${this.albumName} already exists`);
        }
    }

    static async getAlbumId(albumName: string, userId: number): Promise<number> {
        try {
            const albumData = await this.getAlbumData(albumName, userId);
            return albumData.albumId!;
        } catch (err) {
            throw new ApiError(404, `Album ${albumName} does not exist`);
        }
    }

    static async getAlbumData(albumName: string, userId: number): Promise<Album> {
        const query = await connection.query(`SELECT * FROM albums WHERE albumName=? and userId=?`, [
            [albumName],
            [userId]
        ]);
        return JSON.parse(JSON.stringify(query))[0][0];
    }

    static async getAlbumPhotos(albumId: number): Promise<PhotoId[]> {
        const query = (await connection.query('SELECT photoId, waterMark FROM photos WHERE albumId=?', [
            [albumId]
        ])) as any[];
        return query[0];
    }

    static async countPhotos(album: Album): Promise<number> {
        const photos = await Album.getAlbumPhotos(album.albumId!);
        return photos.length;
    }

    static async delete(albumName: string, userId: number): Promise<string> {
        await connection.query('DELETE FROM albums WHERE albumName=? AND userId=?', [[albumName], [userId]]);
        return `Deleted ${albumName}`;
    }
}
