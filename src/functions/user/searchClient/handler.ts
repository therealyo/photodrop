import { Handler } from 'aws-lambda';
import { handleError } from '../../../errors/errorHandler';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';

const searchClientHandler: Handler = async (event) => {
    try {
        const body = event.body;
        return formatJSONResponse({ body });
    } catch (err) {
        handleError(err);
    }
};

export const searchClient = middyfy(searchClientHandler);
