import { verifyOtpSchema } from './../../../validation/client.validation';
import { middyfy } from './../../../libs/lambda';
import clientService from '../../../services/client.service';
import { handleError } from './../../../errors/errorHandler';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway';

const verifyOtpHandler: ValidatedEventAPIGatewayProxyEvent<typeof verifyOtpSchema> = async (event: any) => {
    try {
        const { number, code, newNumber } = event.body;
        const token = await clientService.verifyClient(number, code, newNumber);

        return formatJSONResponse(200, { token });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const verifyOtp = middyfy(verifyOtpHandler, verifyOtpSchema);
