import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.middleware';

export const createAlbumValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string(),
        date: Joi.string()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};

export const deleteAlbumValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        userName: Joi.string().pattern(new RegExp('^[a-zA-Z_]*$')).required()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};
