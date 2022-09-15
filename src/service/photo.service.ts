import { BucketParams } from '../@types/BucketParams';
import { Photo } from '../models/Photo';
import bucket from '../connectors/s3.connector';
import { getPresignedUrl } from './presignedUrl.service';

class PhotoService {
    private getParams(key: string): BucketParams {
        return {
            Bucket: process.env.BUCKET_NAME!,
            Key: key,
            Expires: 60,
            ACL: 'public-read'
        };
    }

    async savePhotos(
        root: string,
        amount: number,
        numbers: string[],
        albumId: number
    ): Promise<string[]> {
        const links = [] as string[];
        for (let i = 0; i < amount; i++) {
            const photo = new Photo(albumId, numbers);
            await photo.generateName();
            await photo.save();
            const params = this.getParams(`${root}/${photo.name}`);
            links.push(await getPresignedUrl('putObject', params));
        }
        return links;
    }
}

export default new PhotoService();
