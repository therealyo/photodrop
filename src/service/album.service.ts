import dotenv from 'dotenv';
import { S3 } from 'aws-sdk';
import { Album } from '../models/Album';
import { User } from '../models/User';
import { BucketParams } from '../@types/BucketParams';

dotenv.config();
class AlbumService {
    private bucket = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    });

    private getParams(key: string): BucketParams {
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
        const params = this.getParams(album.key);
        await this.bucket.putObject(params).promise();
        return album;
    }

    async deleteAlbum(albumName: string, userName: string): Promise<void> {
        const { userId } = (await User.getUserData(userName))[0];
        const params = this.getParams(`${userName}/${albumName}/`);
        await this.bucket.deleteObject(params).promise();
        await Album.delete(albumName, userId!);
    }

    async getAlbums() {}

    async getAlbum() {}
}

export default new AlbumService();
