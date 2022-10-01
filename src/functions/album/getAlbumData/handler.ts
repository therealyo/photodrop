import { formatJSONResponse } from './../../../libs/api-gateway';
import { handleError } from './../../../errors/errorHandler';
import { Handler } from 'aws-lambda';
import { User } from '../../../models/User';
import { middyfy } from '../../../libs/lambda';
import albumService from '../../../services/album.service';

const getAlbumDataHandler: Handler = async (event: any) => {
    try {
        const { albumName } = event.pathParameters;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;

        const albumData = await albumService.getAlbum(user, albumName);
        return formatJSONResponse({ albumData });
    } catch (err) {
        handleError(err);
    }
};

export const getAlbumData = middyfy(getAlbumDataHandler);
