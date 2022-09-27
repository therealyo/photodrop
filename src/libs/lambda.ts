import middy from '@middy/core';
// import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { validate } from '../middleware/validator.middleware';

export const middyfy = (handler, schema?) => {
    if (schema) return middy(handler).use(middyJsonBodyParser()).use(validate(schema)).use(httpErrorHandler());
    else return middy(handler).use(middyJsonBodyParser()).use(httpErrorHandler());
};
