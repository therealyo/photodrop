import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Joi from 'joi';
import { ApiError } from '../errors/api.error';

export const validate = (
    req: Request,
    next: NextFunction,
    schema: Joi.ObjectSchema
) => {
    const options: Joi.ValidationOptions = {
        abortEarly: false,
        allowUnknown: false
    };
    const { error, value } = schema.validate(req.body, options);
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
