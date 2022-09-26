import { ApiError } from './../errors/api.error';
import dotenv from 'dotenv';
import { Album } from '../models/Album';
import { User } from '../models/User';
import bucket from '../connectors/s3.connector';

dotenv.config();

class AlbumService {
    private getParams(key: string) {
        return {
            Bucket: process.env.BUCKET_NAME!,
            Key: key
        };
    }

    async createAlbum(user: User, albumName: string, location: string, date: string | undefined): Promise<string> {
        const album = new Album(albumName, user, location, date);
        const params = this.getParams(`albums/${user.login}/${albumName}/`);
        await album.save();
        await bucket.putObject(params).promise();
        return `Added ${album.albumName}`;
    }

    async deleteAlbum(albumName: string, userName: string): Promise<void> {
        const { userId } = (await User.getUserData(userName))[0];
        const params = this.getParams(`albums/${userName}/${albumName}/`);
        await bucket.deleteObject(params).promise();
        await Album.delete(albumName, userId!);
    }

    async getAlbum(userId: number, albumName: string) {
        const albumData = await Album.getAlbumData(albumName, userId);
        if (albumData) {
            const albumPhotos = await Album.getAlbumPhotos(albumData.albumId!);
            const photos = albumPhotos.map((photo) => {
                return {
                    url: `${process.env.BUCKET_PATH}${albumData.path}${photo.photoId}.jpg`,
                    watermark: photo.waterMark!
                };
            });
            return {
                name: albumData.albumName,
                location: albumData.location,
                date: albumData.date,
                photos: photos
            };
        } else {
            throw ApiError.NotFound('album not found');
        }
    }
}

export default new AlbumService();
