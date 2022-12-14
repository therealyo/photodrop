import { Handler } from 'aws-lambda';

import { middyfy } from './../../../libs/lambda';
import { Client } from '../../../models/Client';
import { handleError } from './../../../errors/errorHandler';
import { formatJSONResponse } from './../../../libs/api-gateway';
import clientService from '../../../services/client.service';

const getClientAlbumPhotosHandler: Handler = async (event: any) => {
    try {
        const { albumId } = event.pathParameters;
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;

        const photos = await clientService.getClientAlbumData(user, albumId);
        return formatJSONResponse(200, { data: photos });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const getAlbumPhotos = middyfy(getClientAlbumPhotosHandler);
