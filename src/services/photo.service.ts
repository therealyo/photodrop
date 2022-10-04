import { Photo } from '../models/Photo';
import { PhoneNumber } from '../models/PhoneNumber';
import { User } from '../models/User';
import { Client } from '../models/Client';
// import { Album } from '../models/Album';

class PhotoService {
    async saveNumbers(user: User, albumId: string, numbers: string[], photos: string[]) {
        const clients = await Promise.all(
            numbers.map(async (number) => {
                const client = await Client.getData(number);
                // console.log(client);
                if (client) {
                    // console.log(client);
                    return client;
                }
                return new Client(number);
            })
        );
        await PhoneNumber.save(user, clients);
        // const albumId = await Album.getAlbumId(user, albumName);
        await Photo.savePhotoNumbersRelation(albumId, photos, clients);
    }
}

export default new PhotoService();
