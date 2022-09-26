import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.middleware';

export const signupValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().pattern(new RegExp('^[a-zA-Z_]*$')).required(),
        password: Joi.string().required(),
        email: Joi.string().email(),
        fullName: Joi.string()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};

export const loginValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().pattern(new RegExp('^[a-zA-Z_]*$')).required(),
        password: Joi.string().required()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};

export const searchClientValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        contains: Joi.string().pattern(new RegExp('^\\+?\\d{10,15}$')).required()
    });
    try {
        validate(req, next, schema, 'query');
    } catch (err) {
        next(err);
    }
};
