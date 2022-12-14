import { middyfy } from './../../../libs/lambda';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from './../../../libs/api-gateway';
import { handleError } from './../../../errors/errorHandler';
import { Client } from '../../../models/Client';
import clientService from '../../../services/client.service';
import { setClientDataSchema } from '../../../validation/client.validation';

const setClientDataHandler: ValidatedEventAPIGatewayProxyEvent<typeof setClientDataSchema> = async (event: any) => {
    try {
        const { name, email } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        await clientService.setPersonalData(user, name, email);

        return formatJSONResponse(200, { message: "profile changed" });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const setClientData = middyfy(setClientDataHandler, setClientDataSchema);
