import dotenv from 'dotenv';
import { Album } from '../models/Album';
import { User } from '../models/User';
import bucket from '../connectors/s3.connector';
import { Photo } from '../models/Photo';

dotenv.config();
class AlbumService {
    private getParams(key: string) {
        return {
            Bucket: process.env.BUCKET_NAME!,
            Key: key
        };
    }

    async createAlbum(
        user: User,
        albumName: string,
        location: string,
        date: string
    ): Promise<Album> {
        const album = new Album(albumName, user, location, date);
        const params = this.getParams(`${user.login}/${albumName}/`);
        await bucket.putObject(params).promise();
        return album;
    }

    async deleteAlbum(albumName: string, userName: string): Promise<void> {
        const { userId } = (await User.getUserData(userName))[0];
        const params = this.getParams(`${userName}/${albumName}/`);
        await bucket.deleteObject(params).promise();
        await Album.delete(albumName, userId!);
    }

    async getAlbums(userId: number): Promise<Album[]> {
        return await Album.getUserAlbums(userId);
    }

    async getAlbum(userId: number, albumName: string) {
        const albumData = await Album.getAlbumData(albumName, userId);
        const photos = await Photo.getAlbumPhotos(albumData.albumId!);
        albumData.photos = photos.map((photo: { photoId: string }) => {
            return `${process.env.BUCKET_PATH}${albumData.path}${photo.photoId}.jpg`;
        });
        return {
            name: albumData.albumName,
            location: albumData.location,
            date: albumData.date,
            photos: albumData.photos
        };
    }
}

export default new AlbumService();
