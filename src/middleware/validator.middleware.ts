import { BaseSchema } from 'yup';
// import { ApiError } from '../errors/api.error';

export const validate = (schema: { body?: BaseSchema; queryStringParameters?: BaseSchema }) => {
    const before = async (request) => {
        try {
            const { body, queryStringParameters } = request.event;

            if (schema.body) {
                schema.body.validateSync(body);
            }

            if (schema.queryStringParameters) {
                schema.queryStringParameters.validateSync(queryStringParameters ?? {});
            }

            return Promise.resolve();
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    errors: e.errors
                })
            };
        }
    };

    return {
        before
    };
};
