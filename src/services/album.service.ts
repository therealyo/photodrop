import { ApiError } from './../errors/api.error';
import * as dotenv from 'dotenv';
import { Album } from '../models/Album';
import { User } from '../models/User';

dotenv.config();

class AlbumService {
    async createAlbum(user: User, name: string, location: string, date: string | undefined): Promise<Album> {
        const album = new Album(name, user, location, date);
        const albumData = await album.save();
        return albumData;
    }

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
