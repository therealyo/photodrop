import { middyfy } from '../../../libs/lambda';
import { getPresignedUrlSchema } from '../../../validation/photo.validation';
import { handleError } from './../../../errors/errorHandler';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway';
import presignedUrlService from '../../../services/presignedUrl.service';
import { User } from '../../../models/User';
import { Photo } from '../../../models/Photo';

const presignedUrlHanlder: ValidatedEventAPIGatewayProxyEvent<typeof getPresignedUrlSchema> = async (event: any) => {
    try {
        const { albumName } = event.pathParameters;
        const { extension } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;
        const photoName = await Photo.generateName();
        const uploadData = await presignedUrlService.getPresignedUrl(
            `albums/${user.email}/${albumName}/${photoName}.${extension}`
        );

        return formatJSONResponse({ data: { key: `${photoName}`, ...uploadData } });
    } catch (err) {
        handleError(err);
    }
};

export const getPresignedUrl = middyfy(presignedUrlHanlder, getPresignedUrlSchema);
