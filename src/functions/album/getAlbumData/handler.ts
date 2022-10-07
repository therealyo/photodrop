import { formatJSONResponse } from './../../../libs/api-gateway';
import { handleError } from './../../../errors/errorHandler';
import { Handler } from 'aws-lambda';
import { User } from '../../../models/User';
import { middyfy } from '../../../libs/lambda';
import albumService from '../../../services/album.service';

const getAlbumDataHandler: Handler = async (event: any) => {
    try {
        const { albumId } = event.pathParameters;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;

        const albumData = await albumService.getAlbum(user, albumId);
        return formatJSONResponse(200, { data: albumData });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const getAlbumData = middyfy(getAlbumDataHandler);
