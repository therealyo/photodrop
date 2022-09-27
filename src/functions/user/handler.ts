import { ApiError } from '../../errors/api.error';
import { middyfy } from '../../libs/lambda';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '../../libs/api-gateway';
import { registrationSchema, loginSchema, getAlbumsSchema, searchClientSchema } from '../../validation/user.validation';

import userService from '../../services/user.service';

const registrationHandler: ValidatedEventAPIGatewayProxyEvent<typeof registrationSchema> = async (event: any) => {
    try {
        const { username, password, email, fullName } = event.body;
        const message = await userService.registration(username, password, email, fullName);
        return formatJSONResponse({ message });
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        } else {
            throw new ApiError(500, err.message);
        }
    }
};

const loginHandler: ValidatedEventAPIGatewayProxyEvent<typeof loginSchema> = async (event: any) => {
    try {
        const { username, password } = event.body;
        const token = await userService.login(username, password);
        return formatJSONResponse({ token });
    } catch (err) {
        console.log(err);
        if (err instanceof ApiError) {
            throw err;
        } else {
            throw new ApiError(500, err.message);
        }
    }
};

const getAlbumsHandler: ValidatedEventAPIGatewayProxyEvent<typeof getAlbumsSchema> = async (event) => {
    try {
        console.log(event);
        const body = event.body;
        return formatJSONResponse({ body });
    } catch (err) {
        throw new ApiError(500, err.message);
    }
};

const searchClientHandler: ValidatedEventAPIGatewayProxyEvent<typeof searchClientSchema> = async (event) => {
    try {
        const body = event.body;
        return formatJSONResponse({ body });
    } catch (err) {
        throw new ApiError(500, err.message);
    }
};

export const registration = middyfy(registrationHandler, registrationSchema);
export const login = middyfy(loginHandler, loginSchema);
export const getAlbums = middyfy(getAlbumsHandler);
export const searchClient = middyfy(searchClientHandler);
