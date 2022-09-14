import { BucketParams } from '../@types/BucketParams';

class PhotoService {
    private getParams(key: string): BucketParams {
        return {
            Bucket: process.env.BUCKET_NAME!,
            Key: key,
            expiresIn: 60
        };
    }

    async savePhotos(
        amount: number,
        numbers: string[],
        albumName: string
    ): Promise<string[]> {
        const links = [] as string[];
        for (let i = 0; i < amount; i++) {}
        return links;
    }
}

export default new PhotoService();
