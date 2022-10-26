import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from './../../../libs/api-gateway';
import { handleError } from './../../../errors/errorHandler';
import { Client } from '../../../models/Client';
import presignedUrlService from '../../../services/presignedUrl.service';
import { middyfy } from './../../../libs/lambda';
import { setClientSelfieSchema } from '../../../validation/client.validation';
import photoService from '../../../services/photo.service';

const setClientSelfieHandler: ValidatedEventAPIGatewayProxyEvent<typeof setClientSelfieSchema> = async (event: any) => {
    try {
        const { extension } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        const photoName = await photoService.generateName();

        const uploadData = await presignedUrlService.getPresignedUrlUpload(
            `selfies/${user.clientId}/${photoName}.${extension}`
        );

        return formatJSONResponse(200, { data: uploadData });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const setClientSelfie = middyfy(setClientSelfieHandler, setClientSelfieSchema);
