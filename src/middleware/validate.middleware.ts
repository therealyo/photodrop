import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../errors/api.error';

export const validate = (req: any, next: NextFunction, schema: Joi.ObjectSchema, part: string) => {
    const options: Joi.ValidationOptions = {
        abortEarly: false,
        allowUnknown: false
    };
    const { error, value } = schema.validate(req[`${part}`], options);
    if (error) {
        throw new ApiError(
            422,
            'Body does not pass validation',
            error.details.map((x) => {
                return x.message;
            })
        );
    }
    next();
};
