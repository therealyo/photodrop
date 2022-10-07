import { middyfy } from '../../../libs/lambda';
import { User } from '../../../models/User';
import photoService from '../../../services/photo.service';
import { addNumbersSchema } from '../../../validation/photo.validation';
import { handleError } from './../../../errors/errorHandler';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from './../../../libs/api-gateway';

const addNumbersToPhotosHanlder: ValidatedEventAPIGatewayProxyEvent<typeof addNumbersSchema> = async (event: any) => {
    try {
        const { numbers, photos, albumId } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;

        await photoService.saveNumbers(user, albumId, numbers, photos);

        return formatJSONResponse(200, { message: 'success' });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const addNumbers = middyfy(addNumbersToPhotosHanlder, addNumbersSchema);
