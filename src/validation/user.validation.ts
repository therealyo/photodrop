import { object, string } from 'yup';

export const registrationSchema = {
    body: object({
        email: string().email().required(),
        password: string().required(),
        username: string().matches(new RegExp('^[a-zA-Z_]*$')),
        fullName: string()
    })
        .default(undefined)
        .required()
};

export const loginSchema = {
    body: object({
        email: string().email().required(),
        password: string().required()
    })
        .default(undefined)
        .required()
};
