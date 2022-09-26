import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.middleware';

export const presignedUrlValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        // numbers: Joi.array()
        //     .items(Joi.string().pattern(new RegExp('^\\+\\d{10,15}$')))
        //     .required(),
        numbers: Joi.array().items(
            Joi.object({ countryCode: Joi.string().required(), phoneNumber: Joi.string().required() }).required()
        ),
        amount: Joi.number().required()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};
