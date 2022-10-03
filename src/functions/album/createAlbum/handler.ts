import { handleError } from './../../../errors/errorHandler';
import { createAlbumSchema } from '../../../validation/album.validation';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway';
import { User } from '../../../models/User';
import albumService from '../../../services/album.service';
import { middyfy } from '../../../libs/lambda';

const createAlbumHandler: ValidatedEventAPIGatewayProxyEvent<typeof createAlbumSchema> = async (event: any) => {
    try {
        const { name, location, date } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;

        const message = await albumService.createAlbum(user, name, location, date);

        return formatJSONResponse({ message });
    } catch (err) {
        handleError(err);
    }
};

export const createAlbum = middyfy(createAlbumHandler, createAlbumSchema);
