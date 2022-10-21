import { object, string } from 'yup';

export const sendOtpSchema = {
    body: object({
        number: string().required(),
        newNumber: string()
    })
};

export const verifyOtpSchema = {
    body: object({
        number: string().required(),
        newNumber: string(),
        code: string().length(6).required()
    })
};

export const setClientDataSchema = {
    body: object({
        name: string(),
        email: string().email()
    })
};

export const setClientSelfieSchema = {
    body: object({
        extension: string().required()
    })
        .default(undefined)
        .required()
};
