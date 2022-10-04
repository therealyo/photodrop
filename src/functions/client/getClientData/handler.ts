import { Handler } from 'aws-lambda';

import { formatJSONResponse } from './../../../libs/api-gateway';
import { middyfy } from './../../../libs/lambda';
import { handleError } from './../../../errors/errorHandler';
import clientService from '../../../services/client.service';
import { Client } from '../../../models/Client';

const getClientHandler: Handler = async (event: any) => {
    try {
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        const userData = await clientService.getClient(user);

        return formatJSONResponse({ data: userData });
    } catch (err) {
        handleError(err);
    }
};

export const getClient = middyfy(getClientHandler);
