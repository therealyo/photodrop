import { middyfy } from '../../../libs/lambda';
import { getPresignedUrlSchema } from '../../../validation/photo.validation';
import { handleError } from './../../../errors/errorHandler';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway';
import presignedUrlService from '../../../services/presignedUrl.service';
import { User } from '../../../models/User';
import { Photo } from '../../../models/Photo';

const presignedUrlHanlder: ValidatedEventAPIGatewayProxyEvent<typeof getPresignedUrlSchema> = async (event: any) => {
    try {
        const { albumId } = event.pathParameters;
        // console.log(albumId);
        const { extension } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;
        const photoName = await Photo.generateName();
        // console.log(`albums/${user.email}/${albumId}/${photoName}.${extension}`);
        const uploadData = await presignedUrlService.getPresignedUrl(
            `albums/${user.email}/${albumId}/${photoName}.${extension}`
        );

        return formatJSONResponse(200, { data: { key: `${photoName}`, ...uploadData } });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const getPresignedUrl = middyfy(presignedUrlHanlder, getPresignedUrlSchema);
