import { object, string, array } from 'yup';

export const getPresignedUrlSchema = {
    body: object({
        extension: string().required()
    })
};

export const addNumbersSchema = {
    body: object({
        photos: array(string()).required(),
        numbers: array(string()).required()
    })
};
