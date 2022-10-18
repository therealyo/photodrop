import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import { validate } from '../middleware/validator.middleware';

export const middyfy = (handler, schema?) => {
    if (schema)
        return middy(handler).use(middyJsonBodyParser()).use(validate(schema)).use(httpErrorHandler()).use(cors());
    else return middy(handler).use(middyJsonBodyParser()).use(httpErrorHandler()).use(cors());
};
