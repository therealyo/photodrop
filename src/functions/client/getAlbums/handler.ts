import { formatJSONResponse } from './../../../libs/api-gateway';
import { handleError } from './../../../errors/errorHandler';
import { Handler } from 'aws-lambda';
import { middyfy } from './../../../libs/lambda';
import { Client } from '../../../models/Client';
import clientService from '../../../services/client.service';

const getClientAlbumsHanlder: Handler = async (event: any) => {
    try {
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        const albums = await clientService.getClientAlbums(user);

        return formatJSONResponse(200, { data: albums });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const getClientAlbums = middyfy(getClientAlbumsHanlder);
