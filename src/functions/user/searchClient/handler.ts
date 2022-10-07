import { Handler } from 'aws-lambda';
import { handleError } from '../../../errors/errorHandler';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';

const searchClientHandler: Handler = async (event) => {
    try {
        const body = event.body;
        return formatJSONResponse(200, { body });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const searchClient = middyfy(searchClientHandler);
