import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.middleware';

export const presignedUrlValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const schema = Joi.object({
        numbers: Joi.array().items(Joi.string()).required(),
        amount: Joi.number().required()
    });
    try {
        validate(req, next, schema);
    } catch (err) {
        next(err);
    }
};
