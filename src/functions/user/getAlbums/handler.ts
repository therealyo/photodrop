import { middyfy } from './../../../libs/lambda';
import { Handler } from 'aws-lambda';
import { handleError } from '../../../errors/errorHandler';
import { formatJSONResponse } from '../../../libs/api-gateway';
import userService from '../../../services/user.service';
import { User } from '../../../models/User';

const getAlbumsHandler: Handler = async (event) => {
    try {
        const user = JSON.parse(event.requestContext.authorizer.user) as User;
        const albums = await userService.getAlbums(user);
        return formatJSONResponse(200, { data: albums });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const getAlbums = middyfy(getAlbumsHandler);
