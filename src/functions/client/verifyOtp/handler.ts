import { verifyOtpSchema } from './../../../validation/client.validation';
import { middyfy } from './../../../libs/lambda';
import clientService from '../../../services/client.service';
import phoneService from '../../../services/phoneNumber.service';
import { handleError } from './../../../errors/errorHandler';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway';

const verifyOtpHandler: ValidatedEventAPIGatewayProxyEvent<typeof verifyOtpSchema> = async (event: any) => {
    try {
        const { number, code, newNumber } = event.body;
        const token = await clientService.verifyClient(
            phoneService.concatNumber(number)!,
            code,
            phoneService.concatNumber(newNumber)
        );

        return formatJSONResponse({ token });
    } catch (err) {
        handleError(err);
    }
};

export const verifyOtp = middyfy(verifyOtpHandler, verifyOtpSchema);
