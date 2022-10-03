import { middyfy } from '../../../libs/lambda';
import { User } from '../../../models/User';
import photoService from '../../../services/photo.service';
import { addNumbersSchema } from '../../../validation/photo.validation';
import { handleError } from './../../../errors/errorHandler';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from './../../../libs/api-gateway';

const addNumbersToPhotosHanlder: ValidatedEventAPIGatewayProxyEvent<typeof addNumbersSchema> = async (event: any) => {
    try {
        const { numbers, photos, albumName } = event.body;
        const user = JSON.parse(event.requestContext.authorizer.user) as User;

        await photoService.saveNumbers(user, albumName, numbers, photos);

        return formatJSONResponse({ message: 'success' });
    } catch (err) {
        handleError(err);
    }
};

export const addNumbers = middyfy(addNumbersToPhotosHanlder, addNumbersSchema);
