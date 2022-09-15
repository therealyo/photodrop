import { BucketParams } from '../@types/BucketParams';
import { Photo } from '../models/Photo';
import { getPresignedUrl } from './presignedUrl.service';
import { PhoneNumber } from '../models/PhoneNumber';
import { User } from '../models/User';
import { Album } from '../models/Album';

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
        user: User,
        albumName: string,
        amount: number,
        numbers: string[]
    ): Promise<string[]> {
        const root = `${user.login}/${albumName}`;
        const links = [] as string[];
        const photos = [] as Photo[];
        const albumId = await Album.getAlbumId(albumName, user.userId!);

        for (let i = 0; i < amount; i++) {
            const photo = new Photo(albumId, numbers);
            await photo.generateName();
            photos.push(photo);
            const params = this.getParams(`${root}/${photo.name}`);
            links.push(await getPresignedUrl('putObject', params));
        }

        const phoneNumbers = numbers.map((num) => {
            return new PhoneNumber(num, user.userId!);
        });
        await PhoneNumber.save(phoneNumbers);

        await Photo.save(photos);

        return links;
    }
}

export default new PhotoService();
