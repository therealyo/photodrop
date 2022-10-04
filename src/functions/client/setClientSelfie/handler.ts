import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from './../../../libs/api-gateway';
import { handleError } from './../../../errors/errorHandler';
import { Photo } from '../../../models/Photo';
import { Client } from '../../../models/Client';
import presignedUrlService from '../../../services/presignedUrl.service';
import { middyfy } from './../../../libs/lambda';
import { setClientSelfieSchema } from '../../../validation/client.validation';

const setClientSelfieHandler: ValidatedEventAPIGatewayProxyEvent<typeof setClientSelfieSchema> = async (event: any) => {
    try {
        const { extension } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        const photoName = await Photo.generateName();

        const uploadData = await presignedUrlService.getPresignedUrl(
            `selfies/${user.clientId}/${photoName}.${extension}`
        );
        await Client.setSelfie(user, `${photoName}.${extension}`);

        return formatJSONResponse({ data: uploadData });
    } catch (err) {
        handleError(err);
    }
};

export const setClientSelfie = middyfy(setClientSelfieHandler, setClientSelfieSchema);
