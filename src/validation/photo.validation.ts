import { object, string } from 'yup';

export const getPresignedUrlSchema = {
    body: object({
        contentType: string().required()
    })
};
