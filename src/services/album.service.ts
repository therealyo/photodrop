import { ApiError } from './../errors/api.error';
import * as dotenv from 'dotenv';
import { Album } from '../models/Album';
import { User } from '../models/User';
// import bucket from '../connectors/s3.connector';

dotenv.config();

class AlbumService {
    // private getParams(key: string) {
    //     return {
    //         Bucket: process.env.BUCKET_NAME!,
    //         Key: key
    //     };
    // }

    async createAlbum(user: User, name: string, location: string, date: string | undefined): Promise<Album> {
        const album = new Album(name, user, location, date);
        const albumData = await album.save();
        return albumData;
    }

    // async deleteAlbum(name: string, userName: string): Promise<void> {
    //     const { userId } = await User.getUserData(userName);
    //     const params = this.getParams(`albums/${userName}/${name}/`);
    //     await bucket.deleteObject(params).promise();
    //     await Album.delete(name, userId!);
    // }

    async getAlbum(user: User, albumId: string) {
        const albumData = await Album.getAlbumData(albumId);
        if (user.userId === albumData.userId) {
            if (albumData) {
                const albumPhotos = await Album.getAlbumPhotos(albumData.albumId!);
                const photos = albumPhotos.map((photo) => {
                    return {
                        url: `${process.env.BUCKET_PATH}${albumData.path}${photo.photoId}.${photo.extension}`
                    };
                });
                return {
                    albumId: albumData.albumId,
                    name: albumData.name,
                    location: albumData.location,
                    date: albumData.date,
                    photos: photos
                };
            } else {
                throw ApiError.NotFound('album not found');
            }
        } else {
            throw ApiError.UnauthorizedError();
        }
    }
}

export default new AlbumService();
