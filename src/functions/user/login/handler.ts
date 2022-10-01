import { ValidatedEventAPIGatewayProxyEvent } from './../../../libs/api-gateway';
import { handleError } from '../../../errors/errorHandler';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import userService from '../../../services/user.service';
import { loginSchema } from '../../../validation/user.validation';

const loginHandler: ValidatedEventAPIGatewayProxyEvent<typeof loginSchema> = async (event: any) => {
    try {
        const { email, password } = event.body;
        const token = await userService.login(email, password);
        return formatJSONResponse({ token });
    } catch (err) {
        handleError(err);
    }
};

export const login = middyfy(loginHandler, loginSchema);
