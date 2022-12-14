import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult | string>;

export const formatJSONResponse = (statusCode: number, response: Record<string, unknown>): APIGatewayProxyResult => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(response)
    };
};
