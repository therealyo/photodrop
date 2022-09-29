import { object, string } from 'yup';

export const registrationSchema = {
    body: object({
        username: string().matches(new RegExp('^[a-zA-Z_]*$')).required(),
        password: string().required(),
        email: string().email(),
        fullName: string()
    })
        .default(undefined)
        .required()
};

export const loginSchema = {
    body: object({
        username: string().matches(new RegExp('^[a-zA-Z_]*$')).required(),
        password: string().required()
    })
        .default(undefined)
        .required()
};
