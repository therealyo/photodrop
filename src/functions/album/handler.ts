import { formatJSONResponse } from './../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { User } from '../../models/User';
import albumService from '../../services/album.service';

const createAlbumHanlder = async (event: any) => {
    try {
        console.log(event);
        const { name, location, date } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;
        console.log(user);
        const message = await albumService.createAlbum(user, name, location, date);
        return formatJSONResponse({ message });
    } catch (err) {}
};
const getAlbumHandler = async () => {};

export const createAlbum = middyfy(createAlbumHanlder);
export const getAlbum = middyfy(getAlbumHandler);
