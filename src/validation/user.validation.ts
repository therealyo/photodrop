import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.middleware';

export const signupValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        login: Joi.string().pattern(new RegExp('^[a-zA-Z_]*$')).required(),
        password: Joi.string().required(),
        email: Joi.string().email(),
        fullName: Joi.string()
    });
    try {
        validate(req, next, schema);
    } catch (err) {
        next(err);
    }
};

export const loginValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        login: Joi.string().pattern(new RegExp('^[a-zA-Z_]*$')).required(),
        password: Joi.string().required()
    });
    try {
        validate(req, next, schema);
    } catch (err) {
        next(err);
    }
};
