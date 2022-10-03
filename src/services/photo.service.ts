import { Photo } from '../models/Photo';
import { PhoneNumber } from '../models/PhoneNumber';
import { User } from '../models/User';
import { Album } from '../models/Album';

class PhotoService {
    async saveNumbers(user: User, albumName: string, numbers: string[], photos: string[]) {
        await PhoneNumber.save(user, numbers);
        const albumId = await Album.getAlbumId(user, albumName);
        await Photo.save(albumId, photos, numbers);
    }
}

export default new PhotoService();
