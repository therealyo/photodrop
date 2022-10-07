import { middyfy } from './../../../libs/lambda';
import { handleError } from './../../../errors/errorHandler';
import { sendOtpSchema } from './../../../validation/client.validation';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway';
import clientService from '../../../services/client.service';
import phoneService from '../../../services/phoneNumber.service';

const sendOtpHandler: ValidatedEventAPIGatewayProxyEvent<typeof sendOtpSchema> = async (event: any) => {
    try {
        const { number, newNumber } = event.body;
        const result = await clientService.createClient(
            phoneService.concatNumber(number)!,
            phoneService.concatNumber(newNumber)
        );

        return formatJSONResponse(200, { message: result });
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

export const sendOtp = middyfy(sendOtpHandler, sendOtpSchema);
