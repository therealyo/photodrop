import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.middleware';

export const sendOtpValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        number: Joi.object({
            countryCode: Joi.string().pattern(new RegExp('^\\+\\d{1,5}$')).required(),
            number: Joi.string().pattern(new RegExp('^\\d{9,10}$'))
        }).required(),
        newNumber: Joi.object({
            countryCode: Joi.string().pattern(new RegExp('^\\+\\d{1,5}$')).required(),
            number: Joi.string().pattern(new RegExp('^\\d{9,10}$'))
        })
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};

export const verifyOtpValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        number: Joi.object({
            countryCode: Joi.string().pattern(new RegExp('^\\+\\d{1,5}$')).required(),
            number: Joi.string().pattern(new RegExp('^\\d{9,10}$'))
        }).required(),
        newNumber: Joi.object({
            countryCode: Joi.string().pattern(new RegExp('^\\+\\d{1,5}$')).required(),
            number: Joi.string().pattern(new RegExp('^\\d{9,10}$'))
        }),
        code: Joi.string().length(6).required()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};

export const personalDataValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email()
    });
    try {
        validate(req, next, schema, 'body');
    } catch (err) {
        next(err);
    }
};
