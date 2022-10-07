import { handleError } from '../../../errors/errorHandler';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import userService from '../../../services/user.service';
import { registrationSchema } from '../../../validation/user.validation';

const registrationHandler: ValidatedEventAPIGatewayProxyEvent<typeof registrationSchema> = async (event: any) => {
    try {
        const { username, password, email, fullName } = event.body;
        const message = await userService.registration(username, password, email, fullName);
        return formatJSONResponse(200, { message });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const registration = middyfy(registrationHandler, registrationSchema);
