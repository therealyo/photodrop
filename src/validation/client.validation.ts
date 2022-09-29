import { object, string } from 'yup';

export const sendOtpSchema = {
    body: object({
        number: object({
            countryCode: string().matches(new RegExp('^\\+\\d{1,5}$')).required(),
            number: string().matches(new RegExp('^\\d{9,10}$')).required()
        })
            .default(undefined)
            .required(),
        newNumber: object({
            countryCode: string().matches(new RegExp('^\\+\\d{1,5}$')).required(),
            number: string().matches(new RegExp('^\\d{9,10}$')).required()
        })
            .default(undefined)
            .notRequired()
    })
};

export const verifyOtpSchema = {
    body: object({
        number: object({
            countryCode: string().matches(new RegExp('^\\+\\d{1,5}$')).required(),
            number: string().matches(new RegExp('^\\d{9,10}$')).required()
        })
            .default(undefined)
            .required(),
        newNumber: object({
            countryCode: string().matches(new RegExp('^\\+\\d{1,5}$')).required(),
            number: string().matches(new RegExp('^\\d{9,10}$')).required()
        })
            .default(undefined)
            .notRequired(),
        code: string().length(6).required()
    })
};

export const setClientDataSchema = {
    body: object({
        name: string().required(),
        email: string().email().required()
    })
};
