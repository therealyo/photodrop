import { Photo } from '../models/Photo';
import { PhoneNumber } from '../models/PhoneNumber';
import { User } from '../models/User';

class PhotoService {
    async saveNumbers(user: User, numbers: string[], photos: string[]) {
        await PhoneNumber.save(user, numbers);
        await Photo.save(photos, numbers);
    }
}

export default new PhotoService();
